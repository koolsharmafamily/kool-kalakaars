import { Anton, Manrope, Noto_Sans_Devanagari } from "next/font/google";

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
 * DEVANAGARI — Noto Sans Devanagari (variable).
 * Subsetted to `devanagari` ONLY. Anton and Manrope already cover Latin, so
 * shipping Noto's Latin glyphs would be pure dead weight.
 *
 * preload is deliberately false: Devanagari is flavour and emphasis only, a
 * handful of glyphs well below the fold. Preloading it would compete with
 * the hero for bandwidth on a mid-range Android connection.
 */
export const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
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
