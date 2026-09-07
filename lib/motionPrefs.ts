/**
 * MOTION PREFERENCES
 * ==================
 * One definition of "may we animate this", shared by CSS and JS.
 *
 * ── THE QUERIES ARE DUPLICATED IN globals.css ON PURPOSE ────────────────────
 * The layout for the pinned category track is decided in CSS, not JS, so it
 * applies before first paint and cannot cause a hydration mismatch or a
 * layout shift after mount. The JS below then attaches the scroll behaviour
 * only when the SAME query matches, so the two can never disagree about which
 * layout is on screen.
 *
 * If you change one, change the other. They are marked in both files.
 */

/** Animation is off entirely for anyone who asked for less motion. */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Where the expensive things are allowed: parallax, the pinned horizontal
 * track, cursor effects.
 *
 *   min-width  1024px  — not a phone, and there is room for a wide track
 *   hover      hover   — excludes touch, which reports `none`
 *   pointer    fine    — a mouse or trackpad, not a fingertip
 *   motion     ok      — respects the OS setting
 *
 * `hover` and `pointer` together are how you exclude touch devices without
 * sniffing the user agent. A tablet with a mouse gets the desktop treatment,
 * which is correct — it is the input device that matters, not the label.
 */
export const DESKTOP_MOTION =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION).matches;
}

export function desktopMotionAllowed(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(DESKTOP_MOTION).matches;
}
