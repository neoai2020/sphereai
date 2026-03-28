/**
 * Deterministic SVG logo when the upstream image API is unavailable or fails.
 * Keeps brand text (first letter), style, and color in sync with the AI form.
 */

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeHex(color: string | undefined): string {
  if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  return "#4F46E5";
}

/** Returns a data URL (SVG) suitable for site_logo and img src. */
export function buildFallbackLogoDataUrl(
  text: string | undefined,
  style: string | undefined,
  color: string | undefined
): string {
  const fill = normalizeHex(color);
  const s = (style || "modern").toLowerCase();
  const trimmed = (text || "Brand").trim() || "Brand";
  const letter = escapeXml(trimmed.charAt(0).toUpperCase());

  let rx = "22";
  let useGradient = true;
  if (s === "minimal") {
    rx = "8";
    useGradient = false;
  } else if (s === "bold") {
    rx = "12";
    useGradient = false;
  } else if (s === "playful") {
    rx = "28";
    useGradient = true;
  } else if (s === "elegant") {
    rx = "16";
    useGradient = true;
  } else if (s === "tech") {
    rx = "14";
    useGradient = true;
  }

  const bg = useGradient
    ? `<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${fill}"/><stop offset="100%" stop-color="${fill}cc"/></linearGradient></defs><rect width="100" height="100" rx="${rx}" ry="${rx}" fill="url(#g)"/>`
    : `<rect width="100" height="100" rx="${rx}" ry="${rx}" fill="${fill}"/>`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512">${bg}<text x="50" y="56" dominant-baseline="middle" text-anchor="middle" font-size="52" font-family="system-ui,Segoe UI,Arial,sans-serif" font-weight="700" fill="#ffffff">${letter}</text></svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}
