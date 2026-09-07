"use client";

import { useEffect, useRef } from "react";
import siteConfig from "@/content/site.config";
import PopImage from "@/components/ui/PopImage";
import Reveal from "@/components/anim/Reveal";
import { subscribeToScroll } from "@/lib/scrollEngine";
import { DESKTOP_MOTION } from "@/lib/motionPrefs";

/**
 * THE THREE CATEGORIES
 * ====================
 * The most visually rich section, and the one carrying all the photography.
 *
 * ── TWO LAYOUTS, CHOSEN BY CSS ──────────────────────────────────────────────
 * DESKTOP (wide + fine pointer + motion allowed)
 *   A tall spacer supplies scroll distance, a sticky child holds the viewport,
 *   and the track inside translates sideways as you scroll. The heading rides
 *   along with the cards so the whole thing reads as one moving board.
 *
 * EVERYWHERE ELSE — every phone, every tablet, anyone with reduced motion
 *   An ordinary vertical stack with staggered reveals. Nothing is pinned,
 *   nothing is scroll-linked, and the section is a normal height.
 *
 * The switch happens in a CSS media query (see .kk-cat-* in globals.css), not
 * in JavaScript, so it applies before first paint. That means no hydration
 * mismatch and no layout shift after mount — the markup is identical in both
 * cases, only the CSS differs.
 *
 * ── WHY THIS IS NOT SCROLL-JACKING ──────────────────────────────────────────
 * The page scrolls natively at its normal speed throughout. Nothing intercepts
 * wheel or touch events, nothing calls scrollTo, no scrollbar is replaced. The
 * horizontal movement is a transform on a sticky element, driven by where the
 * page already is. Stop scrolling and it stops in place; flick it on a
 * trackpad and momentum behaves exactly as it does anywhere else.
 *
 * ── ON THE IMAGES ───────────────────────────────────────────────────────────
 * Licensed stock, greyscaled at build time and coloured by PopImage. Every one
 * is a tight detail crop with no identifiable face — a recognisable band on a
 * stage would imply a Kool Kalakaars night that has not happened yet.
 */

/** Per-card treatment. Hand-tuned, not derived from the index. */
const TREATMENTS = [
  {
    sticker: "ice",
    duotone: "indigoMagenta",
    shape: "angled",
    halftone: "soft",
    rotate: -1.6,
    misregister: 0,
  },
  {
    sticker: "acid",
    duotone: "violetAcid",
    shape: "torn",
    halftone: "medium",
    rotate: 1.2,
    misregister: 0,
  },
  {
    sticker: "magenta",
    duotone: "indigoMagenta",
    shape: "angled",
    halftone: "soft",
    rotate: -0.8,
    misregister: 3,
  },
] as const;

export function Categories() {
  const { copy } = siteConfig;

  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const mq = window.matchMedia(DESKTOP_MOTION);
    let unsubscribe: (() => void) | null = null;

    const attach = () => {
      if (unsubscribe) return;

      unsubscribe = subscribeToScroll({
        el: pin,
        mode: "pin",
        onFrame: (progress) => {
          // How far the track has to travel for its last card to sit flush
          // with the right edge. Measured from the track itself so it adapts
          // to any number of cards without a magic number.
          const distance = track.scrollWidth - window.innerWidth;
          if (distance <= 0) {
            track.style.transform = "";
            return;
          }
          track.style.transform = `translate3d(${(-progress * distance).toFixed(2)}px, 0, 0)`;
        },
      });
    };

    const detach = () => {
      unsubscribe?.();
      unsubscribe = null;
      // Hand the layout back to CSS cleanly.
      track.style.transform = "";
    };

    const sync = () => (mq.matches ? attach() : detach());

    sync();
    mq.addEventListener("change", sync);

    return () => {
      mq.removeEventListener("change", sync);
      detach();
    };
  }, []);

  return (
    <section
      id="categories"
      /**
       * overflow-x-clip, NOT overflow-hidden.
       *
       * `overflow: hidden` turns an element into a scroll container, and
       * `position: sticky` inside a scroll container sticks to THAT container
       * rather than the viewport. Since this section never scrolls internally,
       * the sticky child simply never engages — the track translated correctly
       * while the section scrolled straight past, so it looked like the cards
       * drifted slightly instead of the section pinning.
       *
       * `overflow: clip` clips the same content without establishing a scroll
       * container, so sticky keeps working. Do not change this back.
       */
      className="bg-surface-2 relative scroll-mt-24 overflow-x-clip"
    >
      <div ref={pinRef} className="kk-cat-pin relative">
        <div className="kk-cat-sticky">
          <div
            ref={trackRef}
            className="kk-cat-track mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
          >
            {/* ── INTRO ─────────────────────────────────────────────────────
                Rides with the track on desktop; sits above the stack on
                mobile. Same markup either way. */}
            <Reveal className="kk-cat-intro">
              <p className="text-eyebrow text-cta font-bold">
                <span lang="hi">{copy.categories.eyebrow}</span>
              </p>
              <h2 className="font-display text-d1 mt-4 uppercase">
                {copy.categories.heading}
              </h2>
              <p className="text-lead text-ink-muted mt-6">
                Pick the one that fits what you already do. You only enter one.
              </p>
            </Reveal>

            {copy.categories.items.map((cat, i) => {
              const t = TREATMENTS[i % TREATMENTS.length];

              return (
                <Reveal
                  as="div"
                  key={cat.name}
                  // Stagger only matters in the stacked layout; on the pinned
                  // track the cards are revealed together as the section
                  // arrives, which is what you want for a single moving board.
                  delay={120 * (i + 1)}
                  className="kk-cat-card mt-14 md:mt-0"
                >
                  <PopImage
                    src={cat.image}
                    alt={cat.imageAlt}
                    width={900}
                    height={1125}
                    duotone={t.duotone}
                    halftone={t.halftone}
                    shape={t.shape}
                    sticker={t.sticker}
                    rotate={t.rotate}
                    misregister={t.misregister}
                    preGreyscaled
                    sizes="(max-width: 768px) calc(100vw - 2.5rem), (max-width: 1280px) 33vw, 420px"
                  />

                  <div className="mt-7">
                    <span
                      aria-hidden="true"
                      className="font-display text-cta text-3xl leading-none"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-d3 mt-3 uppercase">
                      {cat.name}
                    </h3>
                    <p className="text-cta text-eyebrow mt-2 font-bold uppercase">
                      {cat.qualifier}
                    </p>
                    <p className="text-ink-muted mt-4">{cat.blurb}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Categories;
