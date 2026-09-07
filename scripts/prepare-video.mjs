/**
 * PREPARE HERO VIDEO
 * ==================
 *   npm run prepare:video
 *
 * Takes the master in Videos/ and produces the two encodes the hero serves,
 * plus the poster frame. Nothing here is hand-run — re-run it whenever the
 * master changes and everything stays consistent.
 *
 * ── WHAT IT DOES AND WHY ────────────────────────────────────────────────────
 *
 * STRIPS THE AUDIO (-an). The hero video is a muted decorative loop. It is
 * never unmuted, there is no control to unmute it, and an audio track would be
 * dead weight on every visitor's connection.
 *
 * DOES NOT UPSCALE. The master is 1280x720. Encoding a "1080p desktop version"
 * from a 720p source invents pixels and costs bandwidth for nothing, so the
 * desktop encode stays at native 720p.
 *
 * ENCODES HARDER THAN LOOKS SENSIBLE. Both files sit under a 72% indigo scrim,
 * so compression artefacts are invisible to the visitor while the bytes are
 * very much visible in the performance budget. CRF 32 and 33 are chosen on
 * that basis, not on how the raw file looks.
 *
 * +faststart puts the moov atom at the front so playback can begin before the
 * whole file has arrived. Without it the browser waits for the full download.
 *
 * yuv420p + profile:main is the combination Safari and older Android will
 * actually decode. Anything more modern risks a silent failure to play.
 */

import { mkdir, writeFile, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { statSync } from "node:fs";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "Videos", "Indie_music_animation.mp4");
const OUT = join(ROOT, "public", "video");

const ENCODES = [
  { name: "hero-desktop", scale: "1280:720", crf: 32 },
  { name: "hero-mobile", scale: "854:480", crf: 33 },
];

/** Poster frames, matching the encodes so the swap to video is seamless. */
const POSTERS = [
  { name: "hero-video-poster-desktop", width: 1600, height: 900 },
  { name: "hero-video-poster-mobile", width: 720, height: 405 },
];

const kb = (p) => (statSync(p).size / 1024).toFixed(0);

async function run() {
  await mkdir(OUT, { recursive: true });

  console.log("\n  ── ENCODES ───────────────────────────────────────");
  for (const enc of ENCODES) {
    const out = join(OUT, `${enc.name}.mp4`);
    execFileSync(ffmpeg, [
      "-v", "error", "-y",
      "-i", SRC,
      "-an",
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", String(enc.crf),
      "-pix_fmt", "yuv420p",
      "-profile:v", "main",
      "-movflags", "+faststart",
      "-vf", `scale=${enc.scale}`,
      out,
    ]);
    console.log(`  ${enc.name.padEnd(16)} ${enc.scale.padEnd(9)} crf ${enc.crf}   ${kb(out)} KB`);
  }

  console.log("\n  ── POSTER ────────────────────────────────────────");
  const framePng = join(OUT, "_frame.png");
  execFileSync(ffmpeg, [
    "-v", "error", "-y", "-i", SRC, "-frames:v", "1", "-vcodec", "png", framePng,
  ]);

  for (const p of POSTERS) {
    const base = sharp(framePng).resize(p.width, p.height, { fit: "cover" });
    const avif = await base.clone().avif({ quality: 26, effort: 9 }).toBuffer();
    const webp = await base.clone().webp({ quality: 40, effort: 6 }).toBuffer();
    await writeFile(join(OUT, `${p.name}.avif`), avif);
    await writeFile(join(OUT, `${p.name}.webp`), webp);
    console.log(
      `  ${p.name.padEnd(30)} avif ${(avif.length / 1024).toFixed(0)} KB   webp ${(webp.length / 1024).toFixed(0)} KB`,
    );
  }

  await unlink(framePng);
  console.log("");
}

run().catch((e) => {
  console.error("\nFAILED:", e.message, "\n");
  process.exit(1);
});
