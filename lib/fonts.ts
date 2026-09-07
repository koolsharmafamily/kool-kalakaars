import { Anton, Manrope } from "next/font/google";
import localFont from "next/font/local";

/**
 * TYPEFACES
 * =========
 * All three are downloaded at build time and served from our own origin.
 * There is no runtime request to Google, so no render-blocking third-party
 * connection and no privacy surface.
 *
 * The Latin and Devanagari faces are composed into a SINGLE stack in
 * app/globals.css (--font-display / --font-body) rather than being applied
 * with different classes. The browser falls through PER GLYPH, so a Hinglish
 * sentence pulls Latin from Manrope and Devanagari from Noto Sans Devanagari
 * with no visible switch mid-sentence and no markup around the Hindi words.
 */

/**
 * DISPLAY — Anton.
 * Single weight, so the file is ~10kb. Genuinely heavy and condensed, which
 * matters because headlines run to 13vw and still have to fit a 360px screen.
 * Chosen over Archivo Black (too wide at 360px), Bebas Neue (caps-only and
 * too light) and Playfair italic (reads editorial, not painted hoarding).
 */
export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
  preload: true,
});

/**
 * BODY — Manrope (variable).
 * Slightly more geometric character than Inter, which sits better against
 * Anton than Inter's deliberate neutrality. Variable, so one file covers
 * every weight we use.
 */
export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  preload: true,
});

/**
 * DEVANAGARI — Noto Sans Devanagari, cut to the exact glyphs this site uses.
 *
 * ── WHY THIS IS A LOCAL FILE AND NOT next/font/google ───────────────────────
 * The full `devanagari` subset that next/font/google ships is 121 KB. This
 * site renders Devanagari in about ten decorative words — the eyebrow above
 * each section heading. Anton and Manrope together are 37 KB, so the Hindi
 * flavour text was costing four times more than every other typeface on the
 * site combined, and Lighthouse put it squarely on the critical path:
 *
 *   document -> stylesheet -> Noto woff2 -> text paints -> LCP
 *
 * scripts/subset-devanagari.mjs reads every Devanagari character actually
 * present in site.config.ts (27 of them) and fetches a font cut to exactly
 * those. Result: 34.4 KB, 71% smaller, same glyphs on screen.
 *
 * ⚠️  RE-RUN THAT SCRIPT WHENEVER YOU CHANGE HINDI TEXT IN THE CONFIG.
 * A character that is not in the subset falls back to a system font and looks
 * wrong. The script prints exactly which characters it included.
 *
 * The file is a variable font covering 400-700 in one payload, which is why
 * there is a single `src` rather than one per weight.
 *
 * preload stays false: this is flavour text, all of it below the fold, and it
 * should never compete with the hero artwork for the first bytes of bandwidth.
 */
export const notoDevanagari = localFont({
  src: "../app/fonts/noto-devanagari-subset.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-noto-dev",
  preload: false,
});

/** Convenience: every font variable, ready to drop on <html>. */
export const fontVariables = [
  anton.variable,
  manrope.variable,
  notoDevanagari.variable,
].join(" ");
