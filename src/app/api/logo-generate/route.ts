import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { text, style, color } = body;

  const params = new URLSearchParams({
    prompt: `${style || "modern"} logo for brand named "${text || "Brand"}", color ${color || "#4F46E5"}, clean vector style, no background`,
    width:  "512",
    height: "512",
  });

  try {
    const response = await fetch("https://google-nano-banana4.p.rapidapi.com/index.php", {
      method: "POST",
      headers: {
        "x-rapidapi-key":  process.env.RAPIDAPI_KEY!,
        "x-rapidapi-host": "google-nano-banana4.p.rapidapi.com",
        "Content-Type":    "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const contentType = response.headers.get("content-type") || "";
    const status = response.status;

    // Image returned directly
    if (contentType.startsWith("image/")) {
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = contentType.split(";")[0];
      return NextResponse.json({ image: `data:${mimeType};base64,${base64}` });
    }

    // Try JSON
    const text2 = await response.text();
    let parsed: any = null;
    try { parsed = JSON.parse(text2); } catch {}

    if (parsed) {
      // Common field names APIs use for image URL
      const imageUrl =
        parsed.image || parsed.url || parsed.logo_url || parsed.logo ||
        parsed.result?.url || parsed.data?.url || parsed.output;
      if (imageUrl) return NextResponse.json({ image: imageUrl });
      // Return full response for debugging
      return NextResponse.json({ debug: parsed, status });
    }

    // Raw text (maybe a URL or base64)
    if (text2.startsWith("http")) return NextResponse.json({ image: text2.trim() });
    if (text2.startsWith("data:")) return NextResponse.json({ image: text2.trim() });

    return NextResponse.json({ debug: text2.slice(0, 500), status, contentType });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
