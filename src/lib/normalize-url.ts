/** Accepts google.com, www.google.com, http(s)://… and returns a full URL, or "" if it is not a web link. */
export function normalizeWebUrl(raw: string): string {
  let value = (raw ?? "").trim();
  if (!value) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) return "";
  if (!/^https?:\/\//i.test(value)) value = `https://${value.replace(/^\/+/, "")}`;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    if (!url.hostname.includes(".") || /\s/.test(value)) return "";
    return value;
  } catch {
    return "";
  }
}

export function isValidWebUrl(raw: string): boolean {
  return normalizeWebUrl(raw) !== "";
}
