/**
 * SSRF mitigation for server-side fetch of user-supplied URLs.
 */

const MAX_RESPONSE_BYTES = 2 * 1024 * 1024; // 2 MiB
const FETCH_TIMEOUT_MS = 20_000;

function ipv4ToLong(ip: string): number | null {
  const parts = ip.split(".").map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return null;
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function isPrivateOrReservedIPv4(long: number): boolean {
  // 10.0.0.0/8
  if ((long >>> 24) === 10) return true;
  // 172.16.0.0/12
  if ((long >>> 24) === 172) {
    const second = (long >>> 16) & 255;
    if (second >= 16 && second <= 31) return true;
  }
  // 192.168.0.0/16
  if ((long >>> 16) === 49320) return true;
  // 127.0.0.0/8
  if ((long >>> 24) === 127) return true;
  // 169.254.0.0/16 link-local
  if ((long >>> 16) === 0xa9fe) return true;
  // 0.0.0.0/8
  if ((long >>> 24) === 0) return true;
  // 100.64.0.0/10 CGNAT
  if (long >= 0x64400000 && long <= 0x647fffff) return true;
  // 192.0.0.0/24
  if ((long >>> 8) === 0xc00000) return true;
  // 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 documentation
  if (
    (long & 0xffffff00) === 0xc0000200 ||
    (long & 0xffffff00) === 0xc6336400 ||
    (long & 0xffffff00) === 0xcb007100
  )
    return true;
  return false;
}

const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;

export function assertUrlSafeForServerFetch(raw: string): { ok: true; url: string } | { ok: false; error: string } {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return { ok: false, error: "Invalid URL" };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, error: "Only HTTPS URLs are allowed" };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, error: "URLs with credentials are not allowed" };
  }

  const host = parsed.hostname.toLowerCase();

  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local")
  ) {
    return { ok: false, error: "This host is not allowed" };
  }

  if (IPV4_REGEX.test(host)) {
    const long = ipv4ToLong(host);
    if (long === null || isPrivateOrReservedIPv4(long)) {
      return { ok: false, error: "This address is not allowed" };
    }
  }

  // Block obvious IPv6 loopback / unique local (simple string checks)
  if (host === "[::1]" || host.startsWith("[::ffff:127.") || host.startsWith("[fc") || host.startsWith("[fd")) {
    return { ok: false, error: "This address is not allowed" };
  }

  return { ok: true, url: parsed.toString() };
}

export async function fetchHtmlWithLimits(url: string): Promise<{ ok: true; html: string } | { ok: false; error: string; status?: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const len = response.headers.get("content-length");
    if (len && /^\d+$/.test(len) && parseInt(len, 10) > MAX_RESPONSE_BYTES) {
      return { ok: false, error: "Response too large", status: 413 };
    }

    const buf = await response.arrayBuffer();
    if (buf.byteLength > MAX_RESPONSE_BYTES) {
      return { ok: false, error: "Response too large", status: 413 };
    }

    if (!response.ok) {
      return { ok: false, error: "Failed to fetch URL", status: 502 };
    }

    const html = new TextDecoder("utf-8", { fatal: false }).decode(buf);
    return { ok: true, html };
  } catch (e: unknown) {
    const name = e instanceof Error ? e.name : "";
    if (name === "AbortError") {
      return { ok: false, error: "Request timed out", status: 504 };
    }
    return { ok: false, error: "Failed to fetch URL", status: 502 };
  } finally {
    clearTimeout(timer);
  }
}
