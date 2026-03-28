import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildFallbackLogoDataUrl } from "@/lib/logo-fallback";

function upstreamIndicatesFailure(parsed: unknown): boolean {
  if (!parsed || typeof parsed !== "object") return false;
  const o = parsed as Record<string, unknown>;
  if (o.status === "error") return true;
  if (typeof o.error === "string") return true;
  const data = o.data;
  if (data && typeof data === "object" && data !== null) {
    if ((data as Record<string, unknown>).status === "error") return true;
  }
  return false;
}

function imageFromParsed(parsed: Record<string, unknown>): string | null {
  const base64 =
    (parsed.image_base64 as string | undefined) ||
    ((parsed.data as Record<string, unknown> | undefined)?.image_base64 as string | undefined) ||
    ((parsed.result as Record<string, unknown> | undefined)?.image_base64 as string | undefined);
  if (typeof base64 === "string" && base64.length > 0) {
    return base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
  }
  const imageUrl =
    (parsed.image as string | undefined) ||
    (parsed.url as string | undefined) ||
    (parsed.logo_url as string | undefined) ||
    (parsed.logo as string | undefined) ||
    ((parsed.result as Record<string, unknown> | undefined)?.url as string | undefined) ||
    ((parsed.data as Record<string, unknown> | undefined)?.url as string | undefined) ||
    (parsed.output as string | undefined);
  if (typeof imageUrl === "string" && imageUrl.length > 0) return imageUrl;
  return null;
}

async function tryRapidApiImage(
  text: string,
  style: string | undefined,
  color: string | undefined
): Promise<string | null> {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return null;

  const params = new URLSearchParams({
    prompt: `${style || "modern"} logo for brand named "${text || "Brand"}", color ${color || "#4F46E5"}, clean vector style, no background`,
    width: "512",
    height: "512",
  });

  try {
    const response = await fetch("https://google-nano-banana4.p.rapidapi.com/index.php", {
      method: "POST",
      headers: {
        "x-rapidapi-key": key,
        "x-rapidapi-host": "google-nano-banana4.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const contentType = response.headers.get("content-type") || "";

    if (contentType.startsWith("image/")) {
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = contentType.split(";")[0];
      return `data:${mimeType};base64,${base64}`;
    }

    const raw = await response.text();
    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      parsed = null;
    }

    if (parsed) {
      if (upstreamIndicatesFailure(parsed)) return null;
      const fromFields = imageFromParsed(parsed);
      if (fromFields) return fromFields;
    }

    if (raw.startsWith("http")) return raw.trim();
    if (raw.startsWith("data:")) return raw.trim();
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { text, style, color } = body as {
    text?: string;
    style?: string;
    color?: string;
  };

  const label = typeof text === "string" ? text : "Brand";
  const upstream = await tryRapidApiImage(label, style, color);
  const image = upstream ?? buildFallbackLogoDataUrl(label, style, color);

  return NextResponse.json({ image });
}
