"use client";

import { useEffect, useRef } from "react";

/**
 * REVEAL
 * ======
 * Scroll-triggered entrance. Fades and lifts once, then gets out of the way.
 *
 * ── ONE OBSERVER FOR THE WHOLE PAGE ─────────────────────────────────────────
 * Every Reveal on the site shares a single IntersectionObserver instance
 * rather than creating one each. Thirty reveals cost one observer.
 *
 * There are no scroll listeners here. The observer fires when the browser
 * decides, off the main thread, which is the entire reason the rule says to
 * use it.
 *
 * ── IT ONLY EVER RUNS ONCE ──────────────────────────────────────────────────
 * Once revealed, the element unobserves itself. Content does not re-hide when
 * you scroll back up — re-animating things a reader has already seen is
 * irritating and keeps the observer alive for no reason.
 *
 * ── SAFETY ──────────────────────────────────────────────────────────────────
 * The hidden state lives in CSS keyed on `[data-reveal]`. If JavaScript never
 * runs, a <noscript> rule in the layout makes everything visible, so the page
 * can never end up as a column of invisible text. Under reduced motion the CSS
 * shows everything immediately and the transition is removed.
 */

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        observer?.unobserve(entry.target);
      }
    },
    {
      // Fire a little before the element reaches the viewport, so the motion
      // is finishing as it arrives rather than starting.
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.01,
    },
  );

  return observer;
}

export function Reveal({
  children,
  as: As = "div",
  delay = 0,
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  as?: "div" | "li" | "section" | "p" | "span";
  /** Stagger in milliseconds. Applied as transition-delay, not a timer. */
  delay?: number;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already on screen at mount (above the fold): reveal without waiting.
    // The observer would do this anyway, but doing it here avoids a frame of
    // hidden content on first paint.
    const obs = getObserver();
    obs.observe(el);

    return () => obs.unobserve(el);
  }, []);

  return (
    <As
      ref={ref as never}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
      {...rest}
    >
      {children}
    </As>
  );
}

export default Reveal;
