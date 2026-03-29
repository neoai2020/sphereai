/**
 * Extract product name, description, and keywords from raw HTML (affiliate landers, etc.).
 * Order-independent meta parsing, JSON-LD, then body heuristics.
 */

const DESCRIPTION_CAP = 1200;
const MIN_BODY_LEN = 80;
const MIN_JSONLD_LEN = 40;

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

function collapseWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  let s = text;
  s = s.replace(/&(#(?:x[0-9a-fA-F]+|\d+)|[a-zA-Z]+);/g, (_, ent: string) => {
    if (ent[0] === "#") {
      const code =
        ent[1].toLowerCase() === "x"
          ? parseInt(ent.slice(2), 16)
          : parseInt(ent.slice(1), 10);
      if (!Number.isNaN(code)) return String.fromCodePoint(code);
      return _;
    }
    const named: Record<string, string> = {
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"',
      apos: "'",
      nbsp: " ",
    };
    return named[ent.toLowerCase()] ?? _;
  });
  return s;
}

/** Read a double- or single-quoted attribute value from a tag attribute string. */
function getAttr(attrs: string, attrName: string): string | null {
  const esc = attrName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const d = new RegExp(`\\b${esc}\\s*=\\s*"([^"]*)"`, "i").exec(attrs);
  if (d) return d[1];
  const s = new RegExp(`\\b${esc}\\s*=\\s*'([^']*)'`, "i").exec(attrs);
  if (s) return s[1];
  return null;
}

/** Parse all meta tags; keys are `name:foo` or `property:og:bar`. */
export function parseMetaTags(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /<meta\s+([^>]*?)\s*\/?>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const content = getAttr(attrs, "content");
    if (content == null || content === "") continue;
    const decoded = decodeHtmlEntities(content.trim());
    const name = getAttr(attrs, "name")?.toLowerCase();
    const property = getAttr(attrs, "property")?.toLowerCase();
    if (name) map.set(`name:${name}`, decoded);
    if (property) map.set(`property:${property}`, decoded);
  }
  return map;
}

function walkJsonLdForDescriptions(node: unknown, bucket: string[]): void {
  if (node == null) return;
  if (Array.isArray(node)) {
    for (const item of node) walkJsonLdForDescriptions(item, bucket);
    return;
  }
  if (typeof node !== "object") return;
  const o = node as Record<string, unknown>;

  const desc = o.description;
  if (typeof desc === "string" && desc.trim().length >= MIN_JSONLD_LEN) {
    bucket.push(decodeHtmlEntities(stripTags(desc).trim()));
  }

  const headline = o.headline;
  if (typeof headline === "string" && headline.trim().length >= MIN_JSONLD_LEN) {
    bucket.push(decodeHtmlEntities(stripTags(headline).trim()));
  }

  for (const v of Object.values(o)) {
    if (v !== desc && v !== headline) walkJsonLdForDescriptions(v, bucket);
  }
}

export function extractBestDescriptionFromJsonLd(html: string): string {
  const scriptRe =
    /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let best = "";
  let m: RegExpExecArray | null;
  while ((m = scriptRe.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      const data = JSON.parse(raw) as unknown;
      const bucket: string[] = [];
      walkJsonLdForDescriptions(data, bucket);
      for (const c of bucket) {
        if (c.length > best.length) best = c;
      }
    } catch {
      /* invalid JSON-LD */
    }
  }
  return best;
}

export function extractBodyTextFallback(html: string): string {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  const hBlock = cleaned.match(
    /<h[23][^>]*>([\s\S]*?)<\/h[23]>\s*(?:<p[^>]*>([\s\S]*?)<\/p>)?/i
  );
  if (hBlock) {
    const h = collapseWhitespace(decodeHtmlEntities(stripTags(hBlock[1])));
    const p = hBlock[2]
      ? collapseWhitespace(decodeHtmlEntities(stripTags(hBlock[2])))
      : "";
    const combined = [h, p].filter(Boolean).join("\n\n");
    if (combined.length >= MIN_BODY_LEN) {
      return combined.length > DESCRIPTION_CAP
        ? combined.slice(0, DESCRIPTION_CAP - 3).trim() + "..."
        : combined;
    }
  }

  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let best = "";
  let pm: RegExpExecArray | null;
  while ((pm = pRe.exec(cleaned)) !== null) {
    const text = collapseWhitespace(decodeHtmlEntities(stripTags(pm[1])));
    if (text.length >= MIN_BODY_LEN && text.length > best.length) best = text;
  }
  if (best.length >= MIN_BODY_LEN) {
    return best.length > DESCRIPTION_CAP
      ? best.slice(0, DESCRIPTION_CAP - 3).trim() + "..."
      : best;
  }
  return "";
}

export type ExtractedProduct = {
  productName: string;
  productDescription: string;
  keywords: string[];
};

export function extractProductFromHtml(html: string): ExtractedProduct {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleRaw = titleMatch ? titleMatch[1] : "";
  const title = collapseWhitespace(decodeHtmlEntities(stripTags(titleRaw)));

  const meta = parseMetaTags(html);

  const keywordsRaw = meta.get("name:keywords") ?? "";
  const keywords = keywordsRaw
    ? keywordsRaw
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  let description =
    meta.get("name:description") ||
    meta.get("property:og:description") ||
    meta.get("property:twitter:description") ||
    "";
  description = description.trim();

  const jsonLdDesc = extractBestDescriptionFromJsonLd(html);
  if (jsonLdDesc && jsonLdDesc.length > description.length) {
    description = jsonLdDesc;
  }

  const bodyDesc = extractBodyTextFallback(html);
  if (bodyDesc.length > description.length) {
    description = bodyDesc;
  }

  const norm = (s: string) => collapseWhitespace(s).toLowerCase();
  if (
    description &&
    title &&
    norm(description) === norm(title) &&
    bodyDesc.length > description.length
  ) {
    description = bodyDesc;
  }

  if (!description.trim()) {
    description =
      meta.get("property:og:title") ||
      meta.get("property:twitter:title") ||
      title;
  }

  description = collapseWhitespace(description);
  if (description.length > DESCRIPTION_CAP) {
    description = description.slice(0, DESCRIPTION_CAP - 3).trim() + "...";
  }

  if (!description.trim() && title) {
    console.warn("[scrape-html] No description extracted; using title only.");
  }

  return {
    productName: title,
    productDescription: description,
    keywords,
  };
}
