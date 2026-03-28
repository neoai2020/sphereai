import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildFallbackLogoDataUrl } from "@/lib/logo-fallback";

/** RapidAPI google-nano-banana4 returns JSON like `{ status, task_id?, image_base64? }`. */
const MAX_BRAND_LEN = 80;

function sanitizeBrand(text: string): string {
  return text
    .replace(/\0/g, "")
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "")
    .trim()
    .slice(0, MAX_BRAND_LEN) || "Brand";
}

function buildLogoPrompt(brand: string, style: string | undefined, color: string | undefined): string {
  const s = (style || "modern").toLowerCase();
  const hex = color && /^#[0-9A-Fa-f]{6}$/i.test(color) ? color : "#4F46E5";
  return `${s} professional app logo for ${brand}, primary color ${hex}, flat vector, centered icon mark, simple shapes, transparent or solid background, high contrast, no photorealistic elements, no text watermark`;
}

function buildSimpleRetryPrompt(brand: string, color: string | undefined): string {
  const hex = color && /^#[0-9A-Fa-f]{6}$/i.test(color) ? color : "#4F46E5";
  return `Minimal vector logo mark for ${brand}, color ${hex}, square composition, clean lines`;
}

function upstreamIndicatesHardFailure(parsed: Record<string, unknown>): boolean {
  if (parsed.status === "error") return true;
  if (parsed.status === "success") return false;
  const err = parsed.error;
  if (typeof err === "string" && err.length > 0) return true;
  const data = parsed.data;
  if (data && typeof data === "object" && data !== null) {
    const d = data as Record<string, unknown>;
    if (d.status === "error") return true;
  }
  return false;
}

function extractImageRecursive(obj: unknown, depth = 0): string | null {
  if (depth > 8 || !obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;

  const b64 =
    (typeof o.image_base64 === "string" && o.image_base64) ||
    (typeof o.imageBase64 === "string" && o.imageBase64) ||
    (typeof o.b64_json === "string" && o.b64_json) ||
    (typeof o.base64 === "string" && o.base64);
  if (b64 && b64.length > 100) {
    return b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`;
  }

  const url =
    (typeof o.url === "string" && o.url.startsWith("http") && o.url) ||
    (typeof o.image === "string" && o.image.startsWith("http") && o.image) ||
    (typeof o.image_url === "string" && o.image_url.startsWith("http") && o.image_url);
  if (url) return url;

  for (const v of Object.values(o)) {
    if (typeof v === "object" && v !== null) {
      const found = extractImageRecursive(v, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

function parseUpstreamBody(raw: string, contentType: string): string | null {
  if (contentType.startsWith("image/")) return null;

  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }

  if (parsed.status === "success") {
    const direct =
      extractImageRecursive(parsed) ||
      (typeof parsed.image_base64 === "string" && parsed.image_base64.length > 100
        ? `data:image/png;base64,${parsed.image_base64}`
        : null);
    if (direct) return direct;
  }

  if (upstreamIndicatesHardFailure(parsed)) return null;

  const fromNested = extractImageRecursive(parsed);
  if (fromNested) return fromNested;

  const imageUrl =
    (typeof parsed.url === "string" && parsed.url) ||
    (typeof parsed.logo_url === "string" && parsed.logo_url) ||
    (typeof parsed.output === "string" && parsed.output.startsWith("http") && parsed.output);
  if (imageUrl && imageUrl.startsWith("http")) return imageUrl;

  const base64 =
    typeof parsed.image_base64 === "string" ? parsed.image_base64 : null;
  if (base64 && base64.length > 100) {
    return base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
  }

  return null;
}

async function callRapidApiLogo(prompt: string): Promise<string | null> {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return null;

  const params = new URLSearchParams({
    prompt,
    width: "512",
    height: "512",
  });

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
  const img = parseUpstreamBody(raw, contentType);
  if (img) return img;

  if (raw.startsWith("http")) return raw.trim();
  if (raw.startsWith("data:")) return raw.trim();
  return null;
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

  const label = sanitizeBrand(typeof text === "string" ? text : "Brand");
  const primary = buildLogoPrompt(label, style, color);

  let upstream: string | null = null;
  try {
    upstream = await callRapidApiLogo(primary);
    if (!upstream) {
      upstream = await callRapidApiLogo(buildSimpleRetryPrompt(label, color));
    }
  } catch {
    upstream = null;
  }

  const image = upstream ?? buildFallbackLogoDataUrl(label, style, color);

  return NextResponse.json({ image });
}
