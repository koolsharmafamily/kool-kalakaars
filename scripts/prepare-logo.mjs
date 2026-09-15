/**
 * PREPARE LOGO
 * ============
 *   npm run prepare:logo
 *
 * Takes Images/KK Logo.jpeg (the lockup on a flat pink ground) and produces
 * everything the site uses. Re-run it whenever the logo file changes.
 *
 * ── WHY THE LOGO KEEPS ITS PINK GROUND ──────────────────────────────────────
 * The obvious move is to key the pink out and float the logo on the indigo
 * page. That was tried and measured: the purple half of the monogram is
 * #4818a8 against the site's #392989 indigo, a contrast of 1.06:1. The K
 * disappears and only the lime ka is left.
 *
 * Recolouring someone's logo is not a build decision, so instead the artwork
 * is left exactly as designed and presented as a pink badge — which also
 * happens to suit the screen-print, sticker-on-a-poster look of the site.
 *
 * The keyed (transparent) versions are still produced, for use on light
 * grounds where the purple reads fine.
 *
 * ── HOW THE KEY WORKS ───────────────────────────────────────────────────────
 * Soft, not hard. Each pixel's opacity comes from how far its colour is from
 * the pink, and the pink contribution is then subtracted back out of its
 * colour, so anti-aliased edges carry no pink halo.
 *
 * ── OUTPUTS ─────────────────────────────────────────────────────────────────
 *   public/brand/kk-mark-badge.png     monogram on a rounded pink square
 *   public/brand/kk-lockup-badge.png   full logo on a rounded pink panel
 *   public/brand/kk-mark.png           monogram, transparent (light grounds)
 *   public/brand/kk-lockup.png         full logo, transparent (light grounds)
 *   app/icon.png, app/apple-icon.png   favicons — mark only, on pink
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "Images", "KK Logo.jpeg");
const OUT = join(ROOT, "public", "brand");

/** Below this colour distance from the ground a pixel is fully transparent… */
const KEY_LOW = 38;
/** …above this it is fully opaque. Between the two it is proportional. */
const KEY_HIGH = 110;
/** Anything further than this from the ground counts as logo when cropping. */
const CONTENT = 60;

const kb = (b) => `${(b.length / 1024).toFixed(1)} KB`;

async function run() {
  await mkdir(OUT, { recursive: true });

  const { data, info } = await sharp(SRC)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  const at = (x, y) => (y * W + x) * 3;
  const corners = [at(4, 4), at(W - 5, 4), at(4, H - 5), at(W - 5, H - 5)];
  const bg = [0, 1, 2].map((c) =>
    Math.round(corners.reduce((s, i) => s + data[i + c], 0) / corners.length),
  );
  const bgHex = "#" + bg.map((v) => v.toString(16).padStart(2, "0")).join("");

  const rgba = Buffer.alloc(W * H * 4);
  const content = new Uint8Array(W * H);
  const rowHasContent = new Array(H).fill(false);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = at(x, y);
      const p = [data[i], data[i + 1], data[i + 2]];
      const d = Math.hypot(p[0] - bg[0], p[1] - bg[1], p[2] - bg[2]);
      const a = Math.min(1, Math.max(0, (d - KEY_LOW) / (KEY_HIGH - KEY_LOW)));
      const o = (y * W + x) * 4;
      for (let c = 0; c < 3; c++) {
        // observed = logo*a + ground*(1-a)  =>  logo = (observed - ground*(1-a)) / a
        const v = a > 0 ? (p[c] - bg[c] * (1 - a)) / a : 0;
        rgba[o + c] = Math.max(0, Math.min(255, Math.round(v)));
      }
      rgba[o + 3] = Math.round(a * 255);
      if (d > CONTENT) {
        content[y * W + x] = 1;
        rowHasContent[y] = true;
      }
    }
  }

  const bounds = (y0, y1) => {
    let minX = W, maxX = 0, minY = H, maxY = 0;
    for (let y = y0; y <= y1; y++)
      for (let x = 0; x < W; x++)
        if (content[y * W + x]) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
    return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  };

  const all = bounds(0, H - 1);
  // The mark is everything above the first empty band of rows beneath it.
  let markEnd = all.top;
  while (markEnd < H && rowHasContent[markEnd]) markEnd++;
  const mark = bounds(all.top, markEnd - 1);

  const keyed = (r) =>
    sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract(r).png().toBuffer();

  /** Piece centred on a rounded pink panel. Nothing outside the piece leaks in. */
  async function badge(region, { padX, padY, square, radius, width }) {
    const piece = await keyed(region);
    let bw = region.width + padX * 2;
    let bh = region.height + padY * 2;
    if (square) bw = bh = Math.max(bw, bh);
    const r = Math.round(Math.min(bw, bh) * radius);
    const mask = Buffer.from(
      `<svg width="${bw}" height="${bh}"><rect width="${bw}" height="${bh}" rx="${r}" ry="${r}"/></svg>`,
    );
    const flat = await sharp({ create: { width: bw, height: bh, channels: 4, background: bgHex } })
      .composite([
        {
          input: piece,
          left: Math.round((bw - region.width) / 2),
          top: Math.round((bh - region.height) / 2),
        },
      ])
      .png()
      .toBuffer();
    const rounded = radius
      ? await sharp(flat).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer()
      : flat;
    return sharp(rounded).resize({ width });
  }

  const outputs = [];
  const save = async (name, img) => {
    const png = await img.png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
    await writeFile(join(OUT, `${name}.png`), png);
    const m = await sharp(png).metadata();
    outputs.push({ name, w: m.width, h: m.height });
    console.log(`  ${name.padEnd(18)} ${m.width}x${m.height}   ${kb(png)}`);
  };

  console.log("\n  ── SITE ─────────────────────────────────────────");
  await save("kk-mark-badge", await badge(mark, { padX: 70, padY: 60, square: true, radius: 0.22, width: 256 }));
  await save("kk-lockup-badge", await badge(all, { padX: 90, padY: 70, square: false, radius: 0.08, width: 720 }));
  await save("kk-mark", sharp(await keyed(mark)).resize({ width: 256 }));
  await save("kk-lockup", sharp(await keyed(all)).resize({ width: 720 }));

  console.log("\n  ── FAVICONS ─────────────────────────────────────");
  for (const [file, px, radius] of [["icon.png", 512, 0.22], ["apple-icon.png", 180, 0]]) {
    // iOS applies its own rounded mask, so the apple icon stays square.
    const img = await badge(mark, { padX: 70, padY: 60, square: true, radius, width: px });
    const buf = await img.png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
    await writeFile(join(ROOT, "app", file), buf);
    console.log(`  app/${file.padEnd(15)} ${px}x${px}   ${kb(buf)}`);
  }

  const mb = outputs.find((o) => o.name === "kk-mark-badge");
  console.log(`\n  ground ${bgHex}   mark badge ${mb.w}x${mb.h}\n`);
}

run().catch((e) => {
  console.error("\nFAILED:", e.message, "\n");
  process.exit(1);
});
