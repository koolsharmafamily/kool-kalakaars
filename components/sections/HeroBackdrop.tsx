import siteConfig from "@/content/site.config";
import Drift from "@/components/anim/Drift";
import HeroMedia from "@/components/sections/HeroMedia";

/**
 * HERO BACKDROP
 * =============
 * Stands in for the Runway video until it exists. When `media.heroVideoDesktop`
 * and friends are filled in, the video element replaces the blob field and
 * everything else here — scrim, halftone, cut-paper accents — stays exactly as
 * it is. That is the whole point of building it in this order: the treatment is
 * already correct when the video lands.
 *
 * ── THE SCRIM IS THE LOAD-BEARING PART ──────────────────────────────────────
 * `ice` text must clear 4.5:1 no matter what is behind it. The worst possible
 * case for a video is a frame that is pure white.
 *
 *   ice                                        relative luminance 0.9204
 *   indigo                                     relative luminance 0.0426
 *   72% indigo composited over pure white      relative luminance 0.1568
 *   contrast of ice against that               (0.9704 / 0.2068) = 4.69:1
 *
 * So a flat 72% indigo scrim guarantees AA for body text over ANY frame,
 * including white, with a little margin. It is a single constant below.
 *
 * This is deliberately a flat scrim rather than a gradient concentrated behind
 * the text. A gradient looks better but only protects the text it was tuned
 * for, and the hero has content from the logo slot at the top to the footnote
 * at the bottom. The brief is explicit that legibility must not depend on the
 * video's own composition, so the guarantee has to cover the whole frame.
 *
 * ── WHERE THE POP-ART ENERGY COMES FROM ─────────────────────────────────────
 * A 72% scrim would mute the blobs into mush if that were the only source of
 * colour. So the loud elements — halftone dots, cut-paper shapes — sit ABOVE
 * the scrim at full strength, positioned in the corners and margins away from
 * the text column. Contrast is guaranteed by the scrim; the noise comes from
 * layers that never sit behind a word.
 */

export function HeroBackdrop() {
  const { media } = siteConfig;
  const hasVideo = Boolean(media.heroVideoDesktop || media.heroVideoMobile);
  const hasMedia = hasVideo || Boolean(media.heroImage);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* ── 1. THE MOVING FIELD ───────────────────────────────────────────
          Radial gradients that fade to transparent, so they read soft with no
          blur() filter anywhere. Only `transform` is animated. */}
      {!hasMedia ? (
        <div className="absolute inset-0">
          <div
            className="kk-blob"
            style={{
              inset: "-25% -10% auto -20%",
              height: "85%",
              background:
                "radial-gradient(closest-side, var(--color-magenta) 0%, transparent 100%)",
              animation: "kk-drift-a 26s infinite",
            }}
          />
          <div
            className="kk-blob"
            style={{
              inset: "auto -25% -30% 10%",
              height: "90%",
              width: "80%",
              background:
                "radial-gradient(closest-side, var(--color-violet) 0%, transparent 100%)",
              animation: "kk-drift-b 34s infinite",
              animationDelay: "-8s",
            }}
          />
          <div
            className="kk-blob"
            style={{
              inset: "10% -20% auto auto",
              height: "70%",
              width: "70%",
              background:
                "radial-gradient(closest-side, var(--color-highlight) 0%, transparent 100%)",
              animation: "kk-drift-c 30s infinite",
              animationDelay: "-14s",
            }}
          />
          {/* Fourth field is desktop-only. Fewer composited layers on the
              phones that actually need the headroom. */}
          <div
            className="kk-blob hidden md:block"
            style={{
              inset: "auto auto -20% -15%",
              height: "60%",
              width: "55%",
              background:
                "radial-gradient(closest-side, var(--color-cta) 0%, transparent 100%)",
              animation: "kk-drift-a 38s infinite",
              animationDelay: "-20s",
            }}
          />
        </div>
      ) : null}

      {/* ── 2. ARTWORK / VIDEO + THE SCRIM ────────────────────────────────
          HeroMedia renders the poster first, mounts video over it only when
          the connection and motion preference allow, and owns the scrim —
          which differs between the two because a video frame cannot be
          inspected in advance but an image can. */}
      <HeroMedia />

      {/* ── 3. ABOVE-SCRIM ACCENTS ────────────────────────────────────────
          Full strength, and kept to the corners so they never sit behind
          text. Static — none of this animates. */}
      <Drift speed={0.12} className="absolute inset-0">
        <div className="halftone-lg text-cta absolute inset-0 opacity-[0.09]" />
      </Drift>

      {/* Cut-paper corners. Hidden below md, and Drift only subscribes on a
          desktop pointer, so on a phone these are static and cost nothing. */}
      <Drift speed={-0.22} className="absolute inset-0 hidden md:block">
        <div
          className="bg-cta absolute -top-16 -left-16 size-56 rotate-12 opacity-25"
          style={{ clipPath: "polygon(0 0, 100% 12%, 88% 100%, 6% 82%)" }}
        />
      </Drift>
      <Drift speed={0.3} className="absolute inset-0 hidden md:block">
        <div
          className="bg-brand absolute -right-20 -bottom-24 size-72 -rotate-6 opacity-40"
          style={{ clipPath: "polygon(8% 0, 100% 6%, 92% 94%, 0 100%)" }}
        />
      </Drift>

      {/* Grounds the bottom edge so the hero hands off into the page. */}
      <div className="from-surface absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent" />
    </div>
  );
}

export default HeroBackdrop;
