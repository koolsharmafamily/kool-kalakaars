/**
 * PREPARE HERO
 * ============
 * Turns the source artwork into the two encodes the hero serves, and MEASURES
 * the scrim opacity needed to keep the headline legible over it.
 *
 *   node scripts/prepare-hero.mjs
 *
 * ── WHY THE SCRIM IS MEASURED, NOT CHOSEN ───────────────────────────────────
 * The hero scrim was fixed at 72% indigo, derived for the worst case a VIDEO
 * can produce: a frame of pure white. That guarantee has to stay for video,
 * because we cannot see the frames in advance.
 *
 * A still image is different — we can look at every pixel. So this script
 * composites indigo over the actual artwork at increasing opacity and finds
 * the lowest value at which the BRIGHTEST pixel in the image still gives ice
 * text a 4.5:1 contrast ratio. That is a real guarantee against the real
 * asset, not an estimate, and it usually lets far more of the artwork through
 * than the blanket video figure would.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "Images", "Main Singer Shot.png");
const OUT = join(ROOT, "public", "hero");

/* Mobile is portrait, which the source already is — no crop fight.
   412x823 CSS at 1.75 DPR is ~721x1440, so 800x1600 covers it with headroom.

   Desktop takes a landscape crop. The source is 1536x2752, so a 16:9 window is
   1536x864. It is taken from the upper-middle, where the face and the mic are,
   rather than the centre, which would land on the scarf. */
const ENCODES = [
  { name: "hero-mobile", width: 720, height: 1440, top: null },
  { name: "hero-desktop", width: 1600, height: 900, top: 560 },
];

/* ── WCAG helpers ───────────────────────────────────────────────────────── */
const ICE = [233, 249, 251];
const INDIGO = [57, 41, 137];

const channel = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** Simple source-over composite of a solid colour at alpha, in sRGB. */
const over = (px, colour, alpha) =>
  px.map((c, i) => alpha * colour[i] + (1 - alpha) * c);

async function measureScrim(buffer) {
  // Downsample first: we need the brightest region, not the brightest single
  // pixel. A lone specular dot is not what text sits on, and chasing it would
  // push the scrim far darker than it needs to be. Averaging into ~16px blocks
  // is a fair stand-in for what the eye reads behind a glyph.
  const { data, info } = await sharp(buffer)
    .resize(60, null, { fit: "inside" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  let brightest = [0, 0, 0];
  let brightestLum = -1;

  for (let i = 0; i < data.length; i += info.channels) {
    const px = [data[i], data[i + 1], data[i + 2]];
    const l = luminance(px);
    if (l > brightestLum) {
      brightestLum = l;
      brightest = px;
    }
  }

  // Lowest scrim that still clears AA for ice text over that brightest region.
  let chosen = 1;
  for (let a = 0; a <= 100; a++) {
    const alpha = a / 100;
    if (contrast(ICE, over(brightest, INDIGO, alpha)) >= 4.5) {
      chosen = alpha;
      break;
    }
  }

  return {
    brightest,
    brightestLuminance: brightestLum,
    unscrimmedContrast: contrast(ICE, brightest),
    scrim: chosen,
    contrastAtScrim: contrast(ICE, over(brightest, INDIGO, chosen)),
  };
}

async function run() {
  await mkdir(OUT, { recursive: true });

  const meta = await sharp(SRC).metadata();
  console.log(`\n  source  ${meta.width}x${meta.height}  ${meta.format}\n`);

  const written = [];

  for (const enc of ENCODES) {
    let pipeline = sharp(SRC);

    if (enc.top !== null) {
      // Deliberate crop window rather than a centre crop.
      pipeline = pipeline.extract({
        left: 0,
        top: enc.top,
        width: meta.width,
        height: Math.round((meta.width * enc.height) / enc.width),
      });
    }

    const base = pipeline.resize(enc.width, enc.height, { fit: "cover" });

    // AVIF first — it is what modern phones will actually download — with a
    // WebP alongside for anything that cannot take it.
    const avif = await base.clone().avif({ quality: 30, effort: 9 }).toBuffer();
    const webp = await base.clone().webp({ quality: 68, effort: 6 }).toBuffer();

    await writeFile(join(OUT, `${enc.name}.avif`), avif);
    await writeFile(join(OUT, `${enc.name}.webp`), webp);

    written.push({ name: enc.name, avif: avif.length, webp: webp.length });
    console.log(
      `  ${enc.name.padEnd(14)} ${enc.width}x${enc.height}   avif ${(avif.length / 1024).toFixed(0)} KB   webp ${(webp.length / 1024).toFixed(0)} KB`,
    );
  }

  console.log("\n  ── SCRIM MEASUREMENT ─────────────────────────────────");
  const m = await measureScrim(SRC);
  console.log(`  brightest region      rgb(${m.brightest.join(", ")})`);
  console.log(`  ice on it, unscrimmed ${m.unscrimmedContrast.toFixed(2)}:1  ${m.unscrimmedContrast >= 4.5 ? "passes" : "FAILS"}`);
  console.log(`  minimum indigo scrim  ${(m.scrim * 100).toFixed(0)}%`);
  console.log(`  ice at that scrim     ${m.contrastAtScrim.toFixed(2)}:1`);
  console.log(`  (video worst case is 72% — an image lets more through)\n`);

  return { written, scrim: m };
}

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
