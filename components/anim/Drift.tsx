"use client";

import { useEffect, useRef } from "react";
import { subscribeToScroll } from "@/lib/scrollEngine";
import { DESKTOP_MOTION } from "@/lib/motionPrefs";

/**
 * DRIFT
 * =====
 * Parallax for decorative layers — halftone fields, cut-paper shapes.
 *
 * ── DESKTOP ONLY, AND IT MEANS IT ───────────────────────────────────────────
 * Subscribes only when DESKTOP_MOTION matches: a wide viewport, a fine
 * pointer, hover capability, and no reduced-motion preference. On any touch
 * device this component subscribes to nothing and writes no transform, so the
 * element is a plain static div and costs exactly what a div costs.
 *
 * It also listens for the media query CHANGING, so dragging a window between a
 * laptop screen and a touchscreen, or toggling reduced motion in the OS, takes
 * effect immediately rather than at the next reload.
 *
 * ── ONE LOOP ────────────────────────────────────────────────────────────────
 * Every Drift on the page shares the single rAF loop in lib/scrollEngine.ts.
 * The callback writes a transform and reads nothing, so it cannot cause layout
 * thrash. `speed` is a fraction of the element's travel: 0.15 is subtle,
 * negative moves against the scroll.
 */

export function Drift({
  children,
  speed = 0.15,
  className = "",
  "aria-hidden": ariaHidden = true,
}: {
  children?: React.ReactNode;
  speed?: number;
  className?: string;
  "aria-hidden"?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia(DESKTOP_MOTION);
    let unsubscribe: (() => void) | null = null;

    const attach = () => {
      if (unsubscribe) return;
      unsubscribe = subscribeToScroll({
        el,
        mode: "through",
        onFrame: (progress) => {
          // -1..1 across the element's travel through the viewport.
          const offset = (progress - 0.5) * 2 * speed * 100;
          el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        },
      });
    };

    const detach = () => {
      unsubscribe?.();
      unsubscribe = null;
      el.style.transform = "";
    };

    const sync = () => (mq.matches ? attach() : detach());

    sync();
    mq.addEventListener("change", sync);

    return () => {
      mq.removeEventListener("change", sync);
      detach();
    };
  }, [speed]);

  return (
    <div ref={ref} aria-hidden={ariaHidden} className={`kk-drift ${className}`}>
      {children}
    </div>
  );
}

export default Drift;
