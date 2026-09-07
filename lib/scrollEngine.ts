"use client";

import { prefersReducedMotion } from "@/lib/motionPrefs";

/**
 * SCROLL ENGINE
 * =============
 * ONE requestAnimationFrame loop for the entire page.
 *
 * Every scroll-linked effect on the site registers here. There are no scroll
 * event listeners anywhere in this codebase, and there is never more than one
 * rAF running — which is the whole point of the rule. Ten parallax layers cost
 * one loop, not ten.
 *
 * ── WHAT IT GUARANTEES ──────────────────────────────────────────────────────
 *
 * · The loop does not exist until something subscribes, and cancels itself the
 *   moment the last subscriber leaves. An idle page runs no animation frames.
 *
 * · It skips work when the scroll position has not moved. Standing still costs
 *   a comparison, not a layout read.
 *
 * · It stops entirely when the tab is hidden, and restarts on return.
 *
 * · Under prefers-reduced-motion it refuses to start at all. Subscribing is a
 *   no-op, so callers do not need to check first.
 *
 * ── READ, THEN WRITE ────────────────────────────────────────────────────────
 * All geometry is read in one pass and all transforms are written in a second
 * pass. Interleaving reads and writes forces the browser to recalculate layout
 * between every subscriber — the classic layout-thrash that makes scroll
 * animation janky on exactly the mid-range Android this site is built for.
 */

type Subscriber = {
  /** The element whose position drives the effect. */
  el: HTMLElement;
  /**
   * Called with 0 to 1 as the element travels through the viewport, and with
   * the element's measured rect. Write transforms here — never read layout.
   */
  onFrame: (progress: number, rect: DOMRect) => void;
  /**
   * "through"  0 when the element's top hits the bottom of the viewport,
   *            1 when its bottom leaves the top. For parallax.
   * "pin"      0 when the element's top reaches the top of the viewport,
   *            1 when its bottom reaches the bottom. For pinned sequences.
   */
  mode: "through" | "pin";
};

const subscribers = new Set<Subscriber>();
let frame: number | null = null;
let lastScrollY = -1;

function tick() {
  frame = null;

  const scrollY = window.scrollY;
  const moved = scrollY !== lastScrollY;
  lastScrollY = scrollY;

  if (moved) {
    const vh = window.innerHeight;

    // ---- READ PASS: every measurement happens before any write. ----
    const measured: Array<{ sub: Subscriber; rect: DOMRect; progress: number }> = [];

    for (const sub of subscribers) {
      const rect = sub.el.getBoundingClientRect();

      let progress: number;
      if (sub.mode === "pin") {
        const distance = rect.height - vh;
        progress = distance <= 0 ? 0 : -rect.top / distance;
      } else {
        const distance = rect.height + vh;
        progress = (vh - rect.top) / distance;
      }

      measured.push({ sub, rect, progress: Math.min(Math.max(progress, 0), 1) });
    }

    // ---- WRITE PASS: transforms only, no layout reads. ----
    for (const m of measured) m.sub.onFrame(m.progress, m.rect);
  }

  if (subscribers.size > 0 && document.visibilityState === "visible") {
    frame = requestAnimationFrame(tick);
  }
}

function start() {
  if (frame !== null) return;
  if (document.visibilityState !== "visible") return;
  lastScrollY = -1; // force one pass so positions are correct on resume
  frame = requestAnimationFrame(tick);
}

function stop() {
  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
}

let visibilityBound = false;
function bindVisibility() {
  if (visibilityBound) return;
  visibilityBound = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && subscribers.size > 0) start();
    else stop();
  });
}

/**
 * Register a scroll-linked effect. Returns an unsubscribe function.
 *
 * Does nothing at all under prefers-reduced-motion — callers can subscribe
 * unconditionally and trust that nothing will move.
 */
export function subscribeToScroll(sub: Subscriber): () => void {
  if (typeof window === "undefined") return () => {};
  if (prefersReducedMotion()) return () => {};

  bindVisibility();
  subscribers.add(sub);
  start();

  return () => {
    subscribers.delete(sub);
    if (subscribers.size === 0) stop();
  };
}

/** Exposed for tests and diagnostics only. */
export function _engineState() {
  return { subscribers: subscribers.size, running: frame !== null };
}
