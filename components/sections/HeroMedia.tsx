import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * HERO MEDIA
 * ==========
 * Three states, in strict order of preference:
 *
 *   1. VIDEO   when media.heroVideoDesktop / heroVideoMobile are set
 *   2. IMAGE   when media.heroImage is set
 *   3. CSS     the animated pop-art field, when neither exists
 *
 * ── A SERVER COMPONENT, ON PURPOSE ──────────────────────────────────────────
 * This used to be a client component that mounted the <video> in a useEffect.
 * That meant the phone could not even START downloading the video until the
 * whole JavaScript bundle had arrived, parsed and hydrated — seconds on a
 * mid-range Android — and only then began buffering a file.
 *
 * Now the <video> element is in the server HTML, and a few lines of inline
 * script directly after it decide whether to play and set the source while
 * the HTML is still being parsed. The download starts at the same moment as
 * the poster image, not after React.
 *
 * ── NO PLAY BUTTON, EVER ────────────────────────────────────────────────────
 * The centred play button phones sometimes show is the browser saying
 * "autoplay was refused". It happens on iOS Low Power Mode, Android data
 * saver, and whenever the `muted` ATTRIBUTE is missing — React sets the muted
 * property but never writes the attribute, and some autoplay checks read the
 * attribute.
 *
 * Two defences:
 *   · the script sets muted as property, default AND attribute before src
 *   · the video stays at opacity 0 until the `playing` event — not
 *     `canplay`, which fires even when autoplay is blocked. If playback never
 *     starts, the video is never shown, the poster simply stays, and there is
 *     nothing to tap. If it was blocked, the first touch anywhere starts it.
 *
 * ── WHEN THE VIDEO IS SKIPPED ENTIRELY ──────────────────────────────────────
 * Not downloaded at all:
 *   prefers-reduced-motion: reduce   an explicit request for no movement
 *   navigator.connection.saveData    the visitor is paying for their data
 *   effectiveType 2g or slow-2g      it would take most of a minute
 *
 * ── CACHING ─────────────────────────────────────────────────────────────────
 * Video URLs carry ?v=<hash of the file>. next.config.ts caches any /video
 * request with a ?v= for a year, so repeat visitors never re-download, and
 * replacing the file changes the hash, so nobody is ever served a stale video.
 *
 * ── THE SCRIM ───────────────────────────────────────────────────────────────
 * VIDEO frames cannot be inspected in advance, so the scrim survives the
 * worst case — pure white — at 72% (derived in HeroBackdrop). An IMAGE can be
 * inspected: scripts/prepare-hero.mjs measured 71% for the current artwork.
 */

/** Worst case for an unknown video frame. See HeroBackdrop for the maths. */
const VIDEO_SCRIM = 0.72;

/**
 * Measured against the current artwork by scripts/prepare-hero.mjs:
 * brightest region rgb(255,255,244), ice on it 4.59:1 at this opacity.
 * RE-RUN THAT SCRIPT AND UPDATE THIS NUMBER IF THE ARTWORK CHANGES.
 */
const IMAGE_SCRIM = 0.71;

/** Below this the mobile encode is served; at or above it, the desktop one. */
const DESKTOP_BREAKPOINT = "(min-width: 768px)";

const VIDEO_ID = "kk-hero-video";

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

/**
 * `/video/hero-mobile.mp4` -> `/video/hero-mobile.mp4?v=3f9a1c2b`.
 * Runs at build time. If the file cannot be read (a typo in the config),
 * the path is returned unversioned rather than breaking the build.
 */
function versioned(path: string | null): string | null {
  if (!path) return null;
  try {
    const bytes = readFileSync(join(process.cwd(), "public", path));
    const hash = createHash("sha1").update(bytes).digest("hex").slice(0, 8);
    return `${path}?v=${hash}`;
  } catch {
    return path;
  }
}

/**
 * Runs inline, during HTML parsing, before any framework code. Kept small and
 * written in plain ES5-ish JavaScript so it runs on old Android browsers too.
 */
const START_SCRIPT = `(function(){
var v=document.getElementById(${JSON.stringify(VIDEO_ID)});if(!v)return;
var mm=window.matchMedia;
if(mm&&mm("(prefers-reduced-motion: reduce)").matches)return;
var c=navigator.connection;
if(c&&(c.saveData||/2g$/.test(c.effectiveType||"")))return;
var desk=mm&&mm(${JSON.stringify(DESKTOP_BREAKPOINT)}).matches;
var src=desk?(v.getAttribute("data-desktop")||v.getAttribute("data-mobile")):(v.getAttribute("data-mobile")||v.getAttribute("data-desktop"));
if(!src)return;
v.muted=true;v.defaultMuted=true;v.setAttribute("muted","");
v.setAttribute("playsinline","");v.setAttribute("webkit-playsinline","");
v.addEventListener("playing",function(){v.setAttribute("data-playing","");if(window.performance&&performance.mark&&!performance.getEntriesByName("kk-video-playing").length)performance.mark("kk-video-playing");});
v.preload="auto";v.src=src;
function go(){var p=v.play();if(p&&p.catch)p.catch(function(){});}
go();
function retry(){go();document.removeEventListener("touchstart",retry);document.removeEventListener("click",retry);}
document.addEventListener("touchstart",retry,{passive:true});
document.addEventListener("click",retry);
document.addEventListener("visibilitychange",function(){if(!document.hidden&&v.paused)go();});
})();`;

export function HeroMedia({ media }: { media: MediaConfig }) {
  const hasVideo = Boolean(media.heroVideoDesktop || media.heroVideoMobile);

  /**
   * With a video, the still shown first is a frame FROM that video, so there
   * is no visible jump when playback starts. Without one, it is the standalone
   * artwork. Either way something is painted before any video byte arrives.
   */
  const image = hasVideo ? media.heroVideoPoster : media.heroImage;

  if (!image && !hasVideo) return null;

  return (
    <>
      {/* ── POSTER / IMAGE ────────────────────────────────────────────────
          In the raw HTML, so the preload scanner finds it before any script
          runs. fetchPriority high: this is the page's largest paint. */}
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
            width={720}
            height={hasVideo ? 405 : 1440}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[50%_32%]"
          />
        </picture>
      ) : null}

      {/* ── VIDEO ─────────────────────────────────────────────────────────
          No src and preload="none" in the HTML: nothing downloads until the
          script below has checked motion, data-saver and connection. No
          `poster` attribute — the <picture> above already is the poster, and
          a native poster is what the browser draws its play button over.

          suppressHydrationWarning: the inline script adds src, muted and
          data-playing before React hydrates. That is intended, not a bug. */}
      {hasVideo ? (
        <>
          <video
            id={VIDEO_ID}
            data-mobile={versioned(media.heroVideoMobile) ?? undefined}
            data-desktop={versioned(media.heroVideoDesktop) ?? undefined}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            className="kk-hero-video absolute inset-0 size-full object-cover"
            suppressHydrationWarning
          />
          <script dangerouslySetInnerHTML={{ __html: START_SCRIPT }} />
        </>
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
