"use client";

import { useEffect, useState } from "react";

/**
 * Reports whether the given element — the hero — has been scrolled past.
 *
 * Used by the sticky nav and the floating WhatsApp button, both of which stay
 * hidden until the hero is behind you. IntersectionObserver, never a scroll
 * listener, so nothing of ours runs on the main thread during a scroll.
 *
 * ── WHY THIS OBSERVES THE WHOLE HERO AND NOT A 1px SENTINEL ─────────────────
 * The obvious implementation puts a 1px marker at the bottom of the hero and
 * watches that. It is subtly broken: IntersectionObserver only fires when the
 * intersection ratio CROSSES a threshold. Jump straight from the top of the
 * page to an anchor further down — which is precisely what every link in this
 * nav does — and a 1px marker goes from "not intersecting, below the fold" to
 * "not intersecting, above the fold" without ever being intersected. No
 * threshold is crossed, no callback fires, and the nav never appears.
 *
 * Observing the full-height hero instead means the state genuinely changes
 * (intersecting -> not intersecting), so the callback always fires. It also
 * makes a deep link land correctly: the first callback on observe() reports
 * "not intersecting" and the nav is there immediately.
 *
 * If the element does not exist — the stub routes have no hero — this returns
 * `true`, so the nav is simply always visible there rather than never.
 */
export function useScrolledPast(elementId: string): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const el = document.getElementById(elementId);

    if (!el) {
      setPast(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Any part of the hero still on screen means we are not past it.
        setPast(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [elementId]);

  return past;
}

/**
 * Reports whether any element carrying `data-fab-avoid` is currently in the
 * lower part of the viewport.
 *
 * This is how the floating WhatsApp button stays out of the way. Mark the
 * ticket form and any mobile sticky CTA with `data-fab-avoid` and the button
 * gets out of the way rather than sitting on top of an input.
 *
 * The bottom rootMargin is negative so the button only retreats once the
 * marked element actually reaches the zone the button occupies — it does not
 * vanish the moment the form is barely on screen.
 */
export function useFabAvoidance(): boolean {
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-fab-avoid]");
    if (targets.length === 0) return;

    const overlapping = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) overlapping.add(entry.target);
          else overlapping.delete(entry.target);
        }
        setShouldHide(overlapping.size > 0);
      },
      {
        // Only the bottom ~45% of the viewport counts as the button's territory.
        rootMargin: "-55% 0px 0px 0px",
        threshold: 0,
      },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return shouldHide;
}
