import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePageContent } from "@/lib/rapidapi/generate";
import { generateSchemaMarkup } from "@/lib/schema/generators";
import type { PageType, Project, Page } from "@/types/database";

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

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const { count, error: countError } = await supabase
      .from("generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if (countError) {
      console.error("Error checking generations:", countError);
    } else if (count !== null && count >= 5) {
      return NextResponse.json(
        { error: "Daily generation limit reached (5/5). Try again tomorrow." },
        { status: 429 }
      );
    }

    const { projectId } = await request.json();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

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

    const results: { pageType: PageType; success: boolean; error?: string }[] = [];

    for (const pageType of PAGE_TYPES) {
      try {
        const { content, title, metaDescription } = await generatePageContent(
          pageType,
          productInfo
        );

        const slug = pageType === "landing" ? "" : pageType;

        const pageData = {
          project_id: projectId,
          page_type: pageType,
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

        const schemaMarkup = generateSchemaMarkup(
          pageType,
          tempPage,
          project as Project
        );

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
            results.push({ pageType, success: false, error: fallbackError.message });
            continue;
          }
        }

        results.push({ pageType, success: true });
      } catch (err) {
        results.push({
          pageType,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    const allSuccess = results.every((r) => r.success);
    if (allSuccess) {
      await Promise.all([
        supabase.from("generations").insert({
          user_id: user.id,
          project_id: projectId,
        }),
        supabase
          .from("projects")
          .update({ status: "published" })
          .eq("id", projectId),
      ]);
    } else {
      await supabase
        .from("projects")
        .update({ status: "partial" })
        .eq("id", projectId);
    }

    return NextResponse.json({ results, status: allSuccess ? "published" : "partial" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
