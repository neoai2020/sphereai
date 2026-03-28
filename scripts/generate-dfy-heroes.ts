/**
 * One-time / CI: build DFY WebP assets under public/dfy/heroes/
 *   {id}.webp, {id}-benefits.webp, {id}-social.webp
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

function picsumForSeed(seed: string): string {
  const safe = seed.replace(/[^a-zA-Z0-9_-]/g, "");
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
    const assets: { file: string; picSeed: string; pollUrl: string | null }[] = [
      { file: `${id}.webp`, picSeed: id, pollUrl: sourceUrl },
      { file: `${id}-benefits.webp`, picSeed: `${id}-benefits`, pollUrl: null },
      { file: `${id}-social.webp`, picSeed: `${id}-social`, pollUrl: null },
    ];

    for (const asset of assets) {
      const outFile = path.join(outDir, asset.file);
      if (!force && existsSync(outFile)) {
        console.log("[skip exists]", asset.file);
        continue;
      }
      if (gradientOnly) {
        await fallbackGradientWebp(asset.picSeed, outFile);
        console.log("[ok gradient]", asset.file);
        continue;
      }
      const url =
        source === "pollinations" && asset.pollUrl ? asset.pollUrl : picsumForSeed(asset.picSeed);
      try {
        await downloadAndOptimize(asset.picSeed, url, outFile);
        console.log(`[ok ${source}]`, asset.file);
      } catch (e) {
        console.error("[fetch failed]", asset.file, e);
        await fallbackGradientWebp(asset.picSeed, outFile);
        console.log("[ok fallback]", asset.file);
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
    console.log(`[site ${i + 1}/${pollinationsTasks.length}]`, id);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
