import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { text, style, color } = body;

  const params = new URLSearchParams({
    text:  text  || "Brand",
    style: style || "modern",
    color: (color || "#4F46E5").replace("#", ""),
  });

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

  // If the API returns an image directly
  if (contentType.startsWith("image/")) {
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = contentType.split(";")[0];
    return NextResponse.json({ image: `data:${mimeType};base64,${base64}` });
  }

  // If JSON response
  const data = await response.json().catch(() => null);
  if (data) return NextResponse.json(data);

  return NextResponse.json({ error: "Unexpected API response" }, { status: 500 });
}
