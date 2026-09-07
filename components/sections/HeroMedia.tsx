"use client";

import { useEffect, useState } from "react";

/**
 * HERO MEDIA
 * ==========
 * Three states, in strict order of preference:
 *
 *   1. VIDEO   when media.heroVideoDesktop / heroVideoMobile are set
 *   2. IMAGE   when media.heroImage is set          <- where we are today
 *   3. CSS     the animated pop-art field, when neither exists
 *
 * ── THE POSTER IS ALWAYS PAINTED FIRST ──────────────────────────────────────
 * The <picture> renders on the server in every case, including when a video is
 * configured. The video is mounted afterwards, on the client, and sits on top
 * of the poster once it can actually play.
 *
 * That ordering is deliberate and does two things at once. The page looks
 * finished before a single byte of video arrives, exactly as the brief
 * requires. And because the decision to load video happens after mount rather
 * than during render, there is no hydration mismatch and no layout shift when
 * it appears — the video occupies the same box the poster already filled.
 *
 * ── WHEN THE VIDEO IS SKIPPED ENTIRELY ──────────────────────────────────────
 * Not downloaded at all — not loaded and paused, not loaded and hidden:
 *
 *   prefers-reduced-motion: reduce   an explicit request for no movement
 *   navigator.connection.saveData    the visitor is paying for their data
 *   effectiveType 2g or slow-2g      several MB would take most of a minute
 *
 * Most of the audience for this site is on a mid-range Android in Nagpur.
 * Spending their data on a decorative loop they did not ask for is a bad
 * trade, and the poster carries the design perfectly well on its own.
 *
 * ── THE SCRIM ───────────────────────────────────────────────────────────────
 * Two different guarantees, because the two cases are genuinely different.
 *
 * VIDEO frames cannot be inspected in advance, so the scrim has to survive the
 * worst case a frame could contain — pure white. That is 72%, derived in
 * HeroBackdrop.
 *
 * An IMAGE can be inspected. scripts/prepare-hero.mjs composites indigo over
 * the real artwork and finds the lowest opacity at which the brightest region
 * still gives ice text 4.5:1. For this artwork that came out at 71% — barely
 * lower, because the piece contains near-white areas. Measured, not guessed,
 * and it re-measures whenever the artwork is replaced.
 */

/** Worst case for an unknown video frame. See HeroBackdrop for the maths. */
const VIDEO_SCRIM = 0.72;

/**
 * Measured against the current artwork by scripts/prepare-hero.mjs:
 * brightest region rgb(255,255,244), ice on it 4.59:1 at this opacity.
 * RE-RUN THAT SCRIPT AND UPDATE THIS NUMBER IF THE ARTWORK CHANGES.
 */
const IMAGE_SCRIM = 0.71;

/** Below this the mobile encode is served; at or above it, the desktop crop. */
const DESKTOP_BREAKPOINT = "(min-width: 768px)";

function videoAllowed(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  // Not in every browser, hence the loose typing rather than a cast to any.
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (connection?.saveData) return false;
  if (connection?.effectiveType === "2g") return false;
  if (connection?.effectiveType === "slow-2g") return false;

  return true;
}

type HeroImage = {
  mobileAvif: string;
  mobileWebp: string;
  desktopAvif: string;
  desktopWebp: string;
  alt: string;
};

type MediaConfig = {
  heroVideoDesktop: string | null;
  heroVideoMobile: string | null;
  heroVideoPoster: HeroImage | null;
  heroImage: HeroImage | null;
};

/** Takes the media block as a prop; see the note in Countdown for why. */
export function HeroMedia({ media }: { media: MediaConfig }) {
  const hasVideo = Boolean(media.heroVideoDesktop || media.heroVideoMobile);

  /**
   * With a video, the still shown first is a frame FROM that video, so there
   * is no visible jump when playback starts. Without one, it is the standalone
   * artwork. Either way something is painted before any video byte arrives.
   */
  const image = hasVideo ? media.heroVideoPoster : media.heroImage;

  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!hasVideo) return;
    if (!videoAllowed()) return;

    /**
     * THE VIDEO SOURCE IS CHOSEN HERE, NOT WITH <source media>.
     *
     * `media` on a <source> element works inside <picture> and is IGNORED
     * inside <video> — browsers simply take the first source whose `type` they
     * support. Written the obvious way, every desktop visitor silently got the
     * mobile encode; measured currentSrc was hero-mobile.mp4 on a 1280px
     * viewport. It fails quietly, which is why it is worth the comment.
     *
     * So the choice is made once, on the client, with matchMedia. The video
     * only mounts on the client anyway, so nothing is lost by doing it here.
     */
    const desktop = window.matchMedia(DESKTOP_BREAKPOINT).matches;
    const chosen = desktop
      ? (media.heroVideoDesktop ?? media.heroVideoMobile)
      : (media.heroVideoMobile ?? media.heroVideoDesktop);

    setVideoSrc(chosen);
    setShowVideo(true);
  }, [hasVideo, media.heroVideoDesktop, media.heroVideoMobile]);

  // Nothing supplied at all — the CSS field in HeroBackdrop stands in.
  if (!image && !hasVideo) return null;

  return (
    <>
      {/* ── POSTER / IMAGE ────────────────────────────────────────────────
          Server-rendered, so the preload scanner finds it in the raw HTML
          before any script runs. fetchPriority high tells the browser this is
          the one image on the page worth queueing ahead of everything else. */}
      {image ? (
        <picture>
          <source
            media={DESKTOP_BREAKPOINT}
            srcSet={image.desktopAvif}
            type="image/avif"
          />
          <source
            media={DESKTOP_BREAKPOINT}
            srcSet={image.desktopWebp}
            type="image/webp"
          />
          <source srcSet={image.mobileAvif} type="image/avif" />
          <source srcSet={image.mobileWebp} type="image/webp" />
          <img
            src={image.mobileWebp}
            alt={image.alt}
            // Intrinsic size of the mobile encode. The box is already fixed by
            // the hero, but stating it keeps the aspect ratio known before
            // download and guarantees no shift.
            width={720}
            height={hasVideo ? 405 : 1440}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[50%_32%]"
          />
        </picture>
      ) : null}

      {/* ── VIDEO ─────────────────────────────────────────────────────────
          Mounted only after the client has confirmed it is wanted. Sits over
          the poster and fades up on canplay, so there is never a black frame
          or a flash of empty box. */}
      {showVideo && videoSrc ? (
        <video
          // `src` directly rather than <source> children — see the note in the
          // effect above for why media-based source selection cannot be used
          // inside <video>.
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          // muted and playsInline are BOTH required or iOS refuses to autoplay.
          poster={image?.mobileAvif ?? image?.mobileWebp}
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          className={[
            "absolute inset-0 size-full object-cover",
            "transition-opacity duration-700 motion-reduce:transition-none",
            videoReady ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      ) : null}

      {/* ── SCRIM ─────────────────────────────────────────────────────────
          Everything above this is decoration. Everything below it is
          guaranteed legible. */}
      <div
        aria-hidden="true"
        className="bg-indigo absolute inset-0"
        style={{ opacity: hasVideo ? VIDEO_SCRIM : IMAGE_SCRIM }}
      />
    </>
  );
}

export default HeroMedia;
