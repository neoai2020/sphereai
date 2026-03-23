import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
    }

    const html = await response.text();

    // Basic extraction logic
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    const getMetaTag = (name: string) => {
      const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([\s\S]*?)["']`, "i");
      const match = html.match(regex);
      if (match) return match[1].trim();
      
      // Try with property (for OG tags)
      const ogRegex = new RegExp(`<meta[^>]*property=["']og:${name}["'][^>]*content=["']([\s\S]*?)["']`, "i");
      const ogMatch = html.match(ogRegex);
      return ogMatch ? ogMatch[1].trim() : "";
    };

    const description = getMetaTag("description") || getMetaTag("title") || "";
    const keywordsString = getMetaTag("keywords") || "";
    const keywords = keywordsString ? keywordsString.split(",").map(k => k.trim()) : [];

    return NextResponse.json({
      productName: title,
      productDescription: description,
      keywords,
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
