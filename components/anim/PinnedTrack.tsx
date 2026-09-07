"use client";

import { useEffect, useRef } from "react";
import { subscribeToScroll } from "@/lib/scrollEngine";
import { DESKTOP_MOTION } from "@/lib/motionPrefs";

/**
 * PINNED TRACK
 * ============
 * The client half of the pinned horizontal category sweep — and ONLY that half.
 *
 * ── WHY THIS COMPONENT EXISTS ───────────────────────────────────────────────
 * The categories section used to be one big "use client" component. That meant
 * everything it touched crossed the boundary with it: PopImage, all three
 * cards of markup, and the entire 40 KB site config, all shipped to the
 * browser to support what is really a dozen lines of scroll maths.
 *
 * Now the section is a server component again and only this wrapper is client
 * code. It takes children it never inspects, so nothing it wraps is dragged
 * into the client bundle. The cards, the images and the copy are rendered on
 * the server and arrive as HTML.
 *
 * ── BEHAVIOUR IS UNCHANGED ──────────────────────────────────────────────────
 * Subscribes to the one shared rAF loop, only when DESKTOP_MOTION matches, and
 * re-syncs live if the media query changes. On touch, on narrow screens, or
 * under reduced motion it subscribes to nothing and writes no transform — the
 * CSS in globals.css lays the same markup out as an ordinary stack.
 */

export function PinnedTrack({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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
          // Measured from the track, so it adapts to any number of cards
          // without a magic number anywhere.
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
    <div ref={pinRef} className="kk-cat-pin relative">
      <div className="kk-cat-sticky">
        <div ref={trackRef} className={`kk-cat-track ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default PinnedTrack;
