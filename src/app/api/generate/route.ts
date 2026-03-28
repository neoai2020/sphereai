import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePageContent } from "@/lib/rapidapi/generate";
import { generateSchemaMarkup } from "@/lib/schema/generators";
import type { PageType, Project, Page } from "@/types/database";
import {
  SITE_FORGE_GENERATION_LIMIT,
  siteForgeGenerationWindowStartISO,
} from "@/lib/site-forge-generation-limit";
import { getUserHasInfiniteAccess } from "@/lib/infinite-access";

const PAGE_TYPES: PageType[] = ["landing", "about", "faq", "blog", "reviews"];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isInfinite = await getUserHasInfiniteAccess(
      supabase,
      user.id,
      user.user_metadata as { plan?: string | null }
    );

    const since = siteForgeGenerationWindowStartISO();

    if (!isInfinite) {
      const { count, error: countError } = await supabase
        .from("generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", since);

      if (countError) {
        console.error("Error checking generations:", countError);
      } else if (count !== null && count >= SITE_FORGE_GENERATION_LIMIT) {
        return NextResponse.json(
          {
            error: `Site Forge limit reached (${SITE_FORGE_GENERATION_LIMIT} full sites per 24 hours). Try again when a slot opens.`,
            code: "GENERATION_LIMIT",
          },
          { status: 429 }
        );
      }
    }

    const { projectId, pageType } = await request.json();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const typesToGenerate = pageType ? [pageType as PageType] : PAGE_TYPES;

    await supabase
      .from("projects")
      .update({ status: "generating" })
      .eq("id", projectId);

    const productInfo = {
      productName: project.product_name,
      productDescription: project.product_description,
      productUrl: project.product_url,
      keywords: project.keywords || [],
      targetAudience: project.target_audience,
    };

    const results = await Promise.all(
      typesToGenerate.map(async (type): Promise<{ pageType: PageType; success: boolean; error?: string }> => {
        try {
          const { content, title, metaDescription, schemaMarkup: aiSchema } = await generatePageContent(
            type,
            productInfo
          );

          const slug = type === "landing" ? "" : type;

          const pageData = {
            project_id: projectId,
            page_type: type,
            title,
            meta_description: metaDescription,
            content,
            slug,
            is_published: true,
          } as Partial<Page>;

          const tempPage = {
            ...pageData,
            id: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            schema_markup: {},
          } as Page;

          const schemaMarkup = {
            ...generateSchemaMarkup(
              type,
              tempPage,
              project as Project,
              user.id
            ),
            ...(aiSchema || {})
          };

          pageData.schema_markup = schemaMarkup;

          const { error: insertError } = await supabase
            .from("pages")
            .upsert(
              { ...pageData },
              { onConflict: "project_id,page_type", ignoreDuplicates: false }
            );

          if (insertError) {
            const { error: fallbackError } = await supabase
              .from("pages")
              .insert(pageData);

            if (fallbackError) {
              return { pageType: type, success: false, error: fallbackError.message };
            }
          }

          return { pageType: type, success: true };
        } catch (err) {
          // Insert a minimal fallback page so the URL doesn't 404
          try {
            const fallbackContent = buildFallbackContent(type, productInfo);
            await supabase
              .from("pages")
              .upsert(
                {
                  project_id: projectId,
                  page_type: type,
                  title: `${productInfo.productName} - ${type}`,
                  meta_description: productInfo.productDescription.slice(0, 155),
                  content: fallbackContent,
                  slug: type === "landing" ? "" : type,
                  is_published: true,
                  schema_markup: {},
                },
                { onConflict: "project_id,page_type", ignoreDuplicates: false }
              );
          } catch (fallbackErr) {
            console.error(`Fallback insert for ${type} also failed:`, fallbackErr);
          }
          return {
            pageType: type,
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
          };
        }
      })
    );

    const isLastOne = pageType ? PAGE_TYPES.indexOf(pageType as PageType) === PAGE_TYPES.length - 1 : true;

    // Always mark as published (partial is better than stuck at "generating")
    if (isLastOne) {
      if (isInfinite) {
        await supabase.from("projects").update({ status: "published" }).eq("id", projectId);
      } else {
      let genId: string | null = null;

      const rpcResult = await supabase.rpc("insert_generation_if_allowed", {
        p_user_id: user.id,
        p_project_id: projectId,
      });

      if (rpcResult.error) {
        const msg = rpcResult.error.message || "";
        const rpcMissing =
          rpcResult.error.code === "PGRST202" ||
          msg.includes("insert_generation_if_allowed") ||
          msg.includes("Could not find the function");

        if (rpcMissing) {
          console.warn(
            "[generate] insert_generation_if_allowed missing — run supabase-migration-004; using non-atomic fallback"
          );
          const { count: c2 } = await supabase
            .from("generations")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", since);

          if ((c2 ?? 0) >= SITE_FORGE_GENERATION_LIMIT) {
            return NextResponse.json(
              {
                error: `Site Forge limit reached (${SITE_FORGE_GENERATION_LIMIT} full sites per 24 hours).`,
                results,
                status: "partial",
                code: "GENERATION_LIMIT",
              },
              { status: 429 }
            );
          }

          const { data: row, error: insErr } = await supabase
            .from("generations")
            .insert({ user_id: user.id, project_id: projectId })
            .select("id")
            .single();

          if (insErr || !row) {
            console.error("Fallback generation insert:", insErr);
            return NextResponse.json(
              {
                error: "Could not record this Site Forge build.",
                results,
                status: "partial",
                code: "GENERATION_RECORD_FAILED",
              },
              { status: 500 }
            );
          }
          genId = row.id as string;
        } else {
          console.error("insert_generation_if_allowed RPC error:", rpcResult.error);
          return NextResponse.json(
            {
              error: "Could not finalize this build. Try again or contact support.",
              results,
              status: "partial",
              code: "GENERATION_RECORD_FAILED",
            },
            { status: 500 }
          );
        }
      } else {
        genId = (rpcResult.data as string | null) ?? null;
      }

      if (!genId) {
        return NextResponse.json(
          {
            error: `Site Forge limit reached (${SITE_FORGE_GENERATION_LIMIT} full sites per 24 hours).`,
            results,
            status: "partial",
            code: "GENERATION_LIMIT",
          },
          { status: 429 }
        );
      }

      await supabase.from("projects").update({ status: "published" }).eq("id", projectId);
      }
    }

    const allProcessed = results.every(r => r.success);

    return NextResponse.json({ results, status: allProcessed ? "published" : "partial" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

function buildFallbackContent(
  type: PageType,
  product: { productName: string; productDescription: string; productUrl: string | null; keywords: string[]; targetAudience: string }
): Record<string, unknown> {
  const fallbacks: Record<PageType, Record<string, unknown>> = {
    landing: {
      hero: {
        headline: product.productName,
        subheadline: product.productDescription.slice(0, 200),
        ctaText: "Get Started",
      },
      features: [{ title: "Coming Soon", description: "Full content is being generated.", icon: "sparkles" }],
      benefits: [{ title: "Quality Content", description: "AI-optimized pages are on their way." }],
      socialProof: { headline: "Trusted Solution", stats: [{ value: "AI", label: "Powered" }] },
      cta: { headline: "Get Started Today", description: "Check back soon for the full experience.", buttonText: "Learn More" },
    },
    about: {
      story: { headline: `About ${product.productName}`, paragraphs: [product.productDescription] },
      mission: { headline: "Our Mission", text: `Providing the best ${product.productName} experience.` },
      values: [{ title: "Quality", description: "We deliver excellence." }],
      team: { headline: "Our Team", description: "Passionate experts behind the product." },
    },
    faq: {
      headline: "Frequently Asked Questions",
      description: `Common questions about ${product.productName}.`,
      faqs: [
        { question: `What is ${product.productName}?`, answer: product.productDescription },
        { question: "How do I get started?", answer: "Visit our website to learn more and sign up." },
      ],
    },
    blog: {
      headline: `Everything You Need to Know About ${product.productName}`,
      author: "SphereAI Team",
      publishDate: new Date().toISOString().split("T")[0],
      readTime: "3 min read",
      introduction: product.productDescription,
      sections: [{ heading: "Overview", paragraphs: [product.productDescription], bulletPoints: [] }],
      conclusion: "Stay tuned for more updates.",
    },
    reviews: {
      headline: "Customer Reviews",
      description: `See what people say about ${product.productName}.`,
      overallRating: 4.5,
      totalReviews: 0,
      reviews: [],
      summary: { headline: "Growing Community", text: "Reviews are being collected." },
    },
  };

  return fallbacks[type] || {};
}
