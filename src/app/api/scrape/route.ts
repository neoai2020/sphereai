import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractProductFromHtml } from "@/lib/scrape-html";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
    }

    const html = await response.text();
    const { productName, productDescription, keywords } = extractProductFromHtml(html);

    return NextResponse.json({
      productName,
      productDescription,
      keywords,
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
