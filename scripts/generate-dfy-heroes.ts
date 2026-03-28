/**
 * One-time / CI: build DFY hero WebP files under public/dfy/heroes/{id}.webp.
 * End users only load these static assets (nothing generated at claim or page view).
 *
 *   npm run generate:dfy-heroes
 *   npm run generate:dfy-heroes -- --force           (rebuild all)
 *   npm run generate:dfy-heroes -- --gradient-only   (offline, unique gradients only)
 *
 * Default source: Picsum (deterministic photo per id). Optional AI: set DFY_HERO_SOURCE=pollinations
 * (uses listDfyHeroSources URLs; may require network access that allows that host).
 */

import { createHash } from "crypto";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { listDfyHeroSources } from "../src/lib/dfy-catalog";

const WIDTH = 1000;
const HEIGHT = 625;

async function fallbackGradientWebp(id: string, outFile: string): Promise<void> {
  const h = createHash("sha256").update(id).digest();
  const c1 = { r: h[0], g: h[1], b: h[2] };
  const c2 = { r: h[8], g: h[9], b: h[10] };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(${c1.r},${c1.g},${c1.b})"/>
      <stop offset="100%" style="stop-color:rgb(${c2.r},${c2.g},${c2.b})"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(outFile);
  console.warn("[fallback gradient]", id);
}

function picsumHeroUrl(id: string): string {
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, "");
  return `https://picsum.photos/seed/${encodeURIComponent(safe)}/${WIDTH}/${HEIGHT}`;
}

async function downloadAndOptimize(id: string, sourceUrl: string, outFile: string): Promise<void> {
  const res = await fetch(sourceUrl, {
    redirect: "follow",
    signal: AbortSignal.timeout(120_000),
    headers: { Accept: "image/*" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
    .webp({ quality: 78 })
    .toFile(outFile);
}

async function main() {
  const force = process.argv.includes("--force");
  const gradientOnly = process.argv.includes("--gradient-only");
  const source = process.env.DFY_HERO_SOURCE === "pollinations" ? "pollinations" : "picsum";
  const outDir = path.join(process.cwd(), "public", "dfy", "heroes");
  await mkdir(outDir, { recursive: true });

  const pollinationsTasks = listDfyHeroSources();
  const delayMs = source === "pollinations" ? 600 : 120;

  for (let i = 0; i < pollinationsTasks.length; i++) {
    const { id, sourceUrl } = pollinationsTasks[i];
    const outFile = path.join(outDir, `${id}.webp`);
    if (!force && existsSync(outFile)) {
      console.log("[skip exists]", id);
      continue;
    }
    if (gradientOnly) {
      await fallbackGradientWebp(id, outFile);
      console.log("[ok gradient]", id, `${i + 1}/${pollinationsTasks.length}`);
      continue;
    }
    const url = source === "pollinations" ? sourceUrl : picsumHeroUrl(id);
    try {
      await downloadAndOptimize(id, url, outFile);
      console.log(`[ok ${source}]`, id, `${i + 1}/${pollinationsTasks.length}`);
    } catch (e) {
      console.error("[fetch failed]", id, e);
      await fallbackGradientWebp(id, outFile);
      console.log("[ok fallback]", id, `${i + 1}/${pollinationsTasks.length}`);
    }
    if (i < pollinationsTasks.length - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
