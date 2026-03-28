import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { generateFacebookPosts } from "@/lib/rapidapi/generate";

export const maxDuration = 120;

function summarizeContentForPrompt(
  content: Record<string, unknown> | null | undefined,
  max = 2800
): string {
  if (!content || typeof content !== "object") return "";
  const chunks: string[] = [];
  const visit = (v: unknown, depth: number) => {
    if (depth > 10) return;
    if (typeof v === "string" && v.trim().length > 15) {
      const t = v.trim();
      chunks.push(t.length > 450 ? `${t.slice(0, 450)}…` : t);
    } else if (Array.isArray(v)) {
      v.forEach((x) => visit(x, depth + 1));
    } else if (v && typeof v === "object") {
      Object.values(v as Record<string, unknown>).forEach((x) => visit(x, depth + 1));
    }
  };
  visit(content, 0);
  return Array.from(new Set(chunks)).join("\n").slice(0, max);
}

async function resolveFromProject(
  supabase: SupabaseClient,
  userId: string,
  projectId: string
): Promise<{ productName: string; productDescription: string; productLink: string } | null> {
  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, user_id, name, slug, product_name, product_description, product_url, keywords, target_audience"
    )
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  if (error || !project) return null;

  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "") || "http://localhost:3000";
  const siteUrl = `${base}/s/${project.slug}`;

  const { data: landing } = await supabase
    .from("pages")
    .select("title, meta_description, content")
    .eq("project_id", projectId)
    .eq("page_type", "landing")
    .maybeSingle();

  const name =
    (project.product_name as string)?.trim() ||
    (project.name as string)?.trim() ||
    "My website";

  const kw = Array.isArray(project.keywords)
    ? (project.keywords as string[]).filter(Boolean).join(", ")
    : "";

  const lines: string[] = [];
  lines.push(`Business / product name: ${name}`);
  const pd = (project.product_description as string)?.trim();
  if (pd) lines.push(`Description from Site Forge:\n${pd}`);
  const ta = (project.target_audience as string)?.trim();
  if (ta) lines.push(`Target audience:\n${ta}`);
  if (kw) lines.push(`Keywords: ${kw}`);

  if (landing) {
    lines.push(`\n--- From the generated landing page ---`);
    if (landing.title) lines.push(`Page title: ${landing.title}`);
    if (landing.meta_description) lines.push(`Meta description: ${landing.meta_description}`);
    const excerpt = summarizeContentForPrompt(landing.content as Record<string, unknown>);
    if (excerpt) lines.push(`On-page copy (excerpt):\n${excerpt}`);
  }

  lines.push(
    `\nWrite Facebook posts that match this offer and tone. Include the promotional link where appropriate.`
  );

  const description = lines.join("\n").trim() || `Website: ${name}.`;
  const url = (project.product_url as string)?.trim();
  const productLink = url && url.length > 0 ? url : siteUrl;

  return { productName: name, productDescription: description, productLink };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const projectId =
      typeof body.projectId === "string" && body.projectId.length > 0 ? body.projectId : null;

    let productName: string;
    let productDescription: string;
    let productLink: string | undefined;

    if (projectId) {
      const resolved = await resolveFromProject(supabase, user.id, projectId);
      if (!resolved) {
        return NextResponse.json({ error: "Website not found" }, { status: 404 });
      }
      productName = resolved.productName;
      productDescription = resolved.productDescription;
      productLink = resolved.productLink;
    } else {
      productName = body.productName;
      productDescription = body.productDescription;
      productLink = body.productLink;
    }

    if (!productName || !productDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const posts = await generateFacebookPosts(productName, productDescription, productLink);

    return NextResponse.json({ posts, linkUsed: productLink || "" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
