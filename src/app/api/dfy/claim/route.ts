import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { projectId, siteName, type } = await req.json();
    const apiKey = process.env.RAPIDAPI_KEY;
    const supabase = createServiceClient();

    if (!projectId) throw new Error("ProjectId missing");
    if (!apiKey) throw new Error("RapidAPI key missing");

    const prompt = `Generate 20 unique and compelling blog article titles for a ${type} business named "${siteName}". 
    Format as valid JSON: { "articles": [{ "title": "...", "slug": "..." }] }
    Each slug should be URL-friendly.`;

    const response = await fetch("https://chatgpt-42.p.rapidapi.com/conversationgpt4-2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        system_prompt: "You are an expert content strategist. Return ONLY JSON.",
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error(`RapidAPI responded with ${response.status}`);

    const data = await response.json();
    let articles = [];
    
    try {
      const parsed = JSON.parse(data.result);
      articles = parsed.articles || [];
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", data.result);
      // Fallback dummy articles
      articles = Array.from({ length: 20 }).map((_, i) => ({
        title: `${siteName} Best Practices Part ${i+1}`,
        slug: `post-${i+1}`
      }));
    }

    // Insert articles as pages
    const pagesToInsert = articles.map((a: any) => ({
      project_id: projectId,
      page_type: 'blog',
      title: a.title,
      slug: a.slug,
      is_published: true,
      content: {
        body: `This is a premium article for ${siteName}. Content is being optimized...`,
        excerpt: `Discover the latest trends in ${type} for ${siteName}.`
      }
    }));

    // Add 180 placeholders to reach 200 total
    const placeholders = Array.from({ length: 180 }).map((_, i) => ({
      project_id: projectId,
      page_type: 'blog' as const,
      title: `${siteName} Growth Strategy Vol. ${i + 1}`,
      slug: `growth-strategy-${i + 1}-${Math.floor(Math.random() * 1000)}`,
      is_published: true,
      content: {
        body: "Placeholder content for DFY site optimization.",
        excerpt: "More content coming soon."
      }
    }));

    const allPages = [...pagesToInsert, ...placeholders];

    const { error: insertError } = await supabase.from("pages").insert(allPages);
    if (insertError) throw insertError;

    return NextResponse.json({ success: true, count: allPages.length });
  } catch (error: any) {
    console.error("DFY Claim API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
