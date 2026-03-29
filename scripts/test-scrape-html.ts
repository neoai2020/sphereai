/**
 * Run: npx tsx scripts/test-scrape-html.ts
 * Live: npx tsx scripts/test-scrape-html.ts --live [url]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { extractProductFromHtml } from "../src/lib/scrape-html";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function main() {
  const liveIdx = process.argv.indexOf("--live");
  if (liveIdx !== -1) {
    const url =
      process.argv[liveIdx + 1] ||
      "https://www.advancedbionutritionals.com/DS24/Advanced-Amino/Muscle-Mass-Loss/HD.htm";
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) {
      console.error("FAIL: fetch", res.status, url);
      process.exit(1);
    }
    const html = await res.text();
    const r = extractProductFromHtml(html);
    console.log("Live extraction:", url);
    console.log("  productName:", r.productName.slice(0, 100));
    console.log("  productDescription length:", r.productDescription.length);
    console.log("  preview:", r.productDescription.slice(0, 220).replace(/\s+/g, " ") + "…");
    if (r.productDescription.length < 80) {
      console.error("FAIL: live description too short");
      process.exit(1);
    }
    console.log("OK: live scrape test passed.");
    return;
  }

  const root = join(__dirname);
  const fixturePath = join(root, "fixtures", "scrape-affiliate-sample.html");
  const html = readFileSync(fixturePath, "utf8");
  const r = extractProductFromHtml(html);

  console.log("Fixture extraction:");
  console.log("  productName:", r.productName.slice(0, 80) + (r.productName.length > 80 ? "…" : ""));
  console.log("  productDescription length:", r.productDescription.length);
  console.log("  keywords:", r.keywords);

  if (!r.productName.includes("Muscles")) {
    console.error("FAIL: expected title in productName");
    process.exit(1);
  }

  if (r.productDescription.length < 80) {
    console.error("FAIL: description should be at least 80 chars (meta/JSON-LD/body)");
    process.exit(1);
  }

  if (!r.keywords.some((k) => /amino/i.test(k))) {
    console.error("FAIL: expected keywords from reversed-order meta");
    process.exit(1);
  }

  console.log("OK: scrape-html fixture tests passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
