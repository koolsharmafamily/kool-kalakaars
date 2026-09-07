/**
 * SUBSET THE DEVANAGARI FONT
 * ==========================
 *   node scripts/subset-devanagari.mjs
 *
 * ── WHY ─────────────────────────────────────────────────────────────────────
 * The full Noto Sans Devanagari subset that next/font/google ships is 121 KB.
 * The site uses it for about ten decorative words — the eyebrows above each
 * section heading. Anton and Manrope together are 37 KB, so the Hindi flavour
 * text was costing four times more than every other typeface on the site
 * combined, and Lighthouse put it on the critical path:
 *
 *   document -> stylesheet -> Noto woff2 -> text renders -> LCP
 *
 * That single file was the largest contributor to a 3.7s LCP against a 2.5s
 * budget.
 *
 * ── HOW ─────────────────────────────────────────────────────────────────────
 * Google Fonts accepts a `text=` parameter and returns a font containing ONLY
 * the glyphs needed to render those characters. This script reads every
 * Devanagari character actually present in site.config.ts, asks Google for a
 * font cut to exactly those, and saves it for next/font/local to serve.
 *
 * ── WHEN TO RE-RUN ──────────────────────────────────────────────────────────
 * Any time you add or change Hindi text in site.config.ts. If you add a word
 * containing a glyph that is not in the subset, it will fall back to a system
 * font and look wrong. The script prints exactly which characters it included
 * so this is easy to check.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = join(ROOT, "content", "site.config.ts");
const OUT_DIR = join(ROOT, "app", "fonts");

/** Devanagari block, plus the vedic extensions and the danda punctuation. */
const DEVANAGARI = /[ऀ-ॿ꣠-ꣿ]/gu;

/** A browser UA, or Google serves the legacy ttf instead of woff2. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function run() {
  const source = await readFile(CONFIG, "utf8");

  const chars = [...new Set(source.match(DEVANAGARI) ?? [])].sort();
  if (chars.length === 0) {
    console.log("\n  No Devanagari found in site.config.ts. Nothing to do.\n");
    return;
  }

  const text = chars.join("");
  console.log(`\n  ${chars.length} unique Devanagari characters in use:`);
  console.log(`  ${text}\n`);

  const cssUrl =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700" +
    `&text=${encodeURIComponent(text)}&display=swap`;

  const cssRes = await fetch(cssUrl, { headers: { "User-Agent": UA } });
  if (!cssRes.ok) throw new Error(`Google Fonts CSS: HTTP ${cssRes.status}`);
  const css = await cssRes.text();

  /* Subsetted fonts are served from a /l/font?kit=... endpoint rather than a
     path ending in .woff2, so match on the format() declaration that follows
     the url rather than on the file extension. */
  const urls = [...css.matchAll(/url\((https:[^)]+)\)\s*format\('woff2'\)/g)].map(
    (m) => m[1],
  );
  if (urls.length === 0) {
    throw new Error(`No woff2 in the returned CSS:\n${css.slice(0, 400)}`);
  }

  await mkdir(OUT_DIR, { recursive: true });

  /* Noto Sans Devanagari is a VARIABLE font, so Google returns the same file
     for every weight requested — one subset covering the whole 400-700 axis.
     Downloading it twice and shipping both would double the cost for nothing,
     so identical payloads are collapsed into a single file. */
  const seen = new Map(); // hash -> filename
  const written = [];

  for (const url of urls) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`font download: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());

    const hash = createHash("md5").update(buf).digest("hex");
    if (seen.has(hash)) {
      console.log(`  (weight duplicate of ${seen.get(hash)} — not written)`);
      continue;
    }

    const name = "noto-devanagari-subset.woff2";
    await writeFile(join(OUT_DIR, name), buf);
    seen.set(hash, name);
    written.push({ name, bytes: buf.length });
    console.log(`  ${name.padEnd(34)} ${(buf.length / 1024).toFixed(1)} KB`);
  }

  const total = written.reduce((n, w) => n + w.bytes, 0);
  const before = 121490;
  console.log(
    `\n  ${(total / 1024).toFixed(1)} KB, down from ${(before / 1024).toFixed(1)} KB ` +
      `(${(100 - (total / before) * 100).toFixed(0)}% smaller)\n`,
  );
}

run().catch((e) => {
  console.error("\nFAILED:", e.message, "\n");
  process.exit(1);
});
