import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractProductFromHtml } from "@/lib/scrape-html";
import { assertUrlSafeForServerFetch, fetchHtmlWithLimits } from "@/lib/scrape-url-safe";

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

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const safe = assertUrlSafeForServerFetch(url);
    if (!safe.ok) {
      return NextResponse.json({ error: safe.error }, { status: 400 });
    }

    const fetched = await fetchHtmlWithLimits(safe.url);
    if (!fetched.ok) {
      const status = fetched.status ?? 502;
      return NextResponse.json({ error: fetched.error }, { status: status >= 400 && status < 600 ? status : 502 });
    }

    const { productName, productDescription, keywords } = extractProductFromHtml(fetched.html);

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
