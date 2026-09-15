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

/**
 * Tuned for STARTING FAST on a phone, not for how the file looks paused.
 *
 * The old mobile encode (CRF 33) averaged 918 kb/s. A typical Indian 4G
 * connection cannot reliably download that faster than it plays, so the
 * browser waited to buffer before starting. These settings were chosen by
 * encoding six candidates and comparing frames: 480p at CRF 41 capped at
 * 550 kb/s came out at ~400 kb/s and 490 KB — under half — and still reads
 * clearly under the 72% scrim. 360p was lighter but visibly soft.
 *
 * maxrate/bufsize cap the busiest moments so no single second spikes.
 */
const ENCODES = [
  { name: "hero-desktop", scale: "1280:720", crf: 36, maxrate: "1100k", bufsize: "2200k" },
  { name: "hero-mobile", scale: "854:480", crf: 41, maxrate: "550k", bufsize: "1100k" },
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
      "-preset", "veryslow",
      "-crf", String(enc.crf),
      "-maxrate", enc.maxrate,
      "-bufsize", enc.bufsize,
      // A keyframe every 2s (24 fps). The old file had two in ten seconds;
      // a player can only begin cleanly at a keyframe, and loops restart on
      // one. -sc_threshold 0 stops extra ones being inserted on scene cuts.
      "-g", "48",
      "-keyint_min", "48",
      "-sc_threshold", "0",
      "-pix_fmt", "yuv420p",
      "-profile:v", "main",
      "-movflags", "+faststart",
      "-vf", `scale=${enc.scale}:flags=lanczos`,
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
