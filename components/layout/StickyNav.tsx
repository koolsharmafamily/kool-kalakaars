"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useScrolledPast } from "@/lib/hooks/useSentinel";

/**
 * STICKY NAV
 * ==========
 * Hidden while the hero is on screen, slides in once it is behind you.
 *
 * ── WHY THE SPONSOR BUTTON IS BUILT THIS WAY ────────────────────────────────
 * Sponsors are the primary audience for this site, and the brief requires
 * "Become a Sponsor" to be reachable in one action from anywhere on the page.
 * So it is NOT a nav item. It is a filled acid button that sits outside the
 * list, and it stays visible at every breakpoint — including 320px, where it
 * sits beside the menu toggle rather than inside the menu. Folding the primary
 * CTA into a hamburger would defeat the entire requirement.
 *
 * ── MOBILE MENU: DELIBERATELY NOT A FOCUS TRAP ──────────────────────────────
 * The menu is a non-modal disclosure, not a modal dialog. It renders directly
 * after its toggle button in the DOM, so Tab walks straight into it and then
 * straight out the other side — the natural reading order, with nothing
 * holding focus hostage. There is no `inert` on the rest of the page and no
 * focus cycling.
 *
 * What it does do:
 *   · Escape closes it and returns focus to the toggle
 *   · a click outside closes it
 *   · choosing a link closes it
 *   · `aria-expanded` / `aria-controls` describe the state honestly
 *
 * ── ONE-THUMB OPERATION ─────────────────────────────────────────────────────
 * The panel opens upward from the BOTTOM of the screen, not down from the top,
 * so every link lands in the natural thumb arc on a tall phone. Targets are
 * 56px tall. The toggle itself is bottom-right, the easiest place to reach.
 */

type NavProps = {
  items: ReadonlyArray<{ label: string; href: string }>;
  primary: { label: string; href: string };
  siteName: string;
  logo: string | null;
  logoWidth: number;
  logoHeight: number;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
};

/**
 * Everything it needs arrives as props. Importing the config module here
 * shipped all 40 KB of site copy to the browser to supply a four-item menu.
 */
export function StickyNav({
  items,
  primary,
  siteName,
  logo,
  logoWidth,
  logoHeight,
  phoneDisplay,
  phoneE164,
  email,
}: NavProps) {
  const past = useScrolledPast("top");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Escape closes and hands focus back to the control that opened it.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };

    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !toggleRef.current?.contains(target)
      ) {
        close();
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  // The nav itself hides while the hero is on screen. When it is hidden it is
  // also removed from the tab order — a keyboard user is never sent to a
  // control that is not visible.
  const hidden = !past;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50",
        "border-rule bg-surface/92 border-b backdrop-blur-md",
        "transition-[transform,opacity] duration-300 ease-out",
        "motion-reduce:transition-none",
        hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100",
      ].join(" ")}
      // Hidden from assistive tech AND removed from the tab order while it is
      // off screen. `inert` must be a real boolean — an empty string is falsy
      // to React and silently does nothing, which leaves invisible links
      // tabbable and puts focusable elements inside an aria-hidden subtree.
      aria-hidden={hidden}
      inert={hidden}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6"
      >
        {/* ── WORDMARK ────────────────────────────────────────────────────
            The logo does not exist yet. Until media.logo is set, this is a
            type-only wordmark at the same height, so nothing moves when the
            real logo lands. */}
        <Link
          href="#top"
          className="font-display text-ink shrink-0 text-xl leading-none tracking-tight sm:text-2xl"
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={siteName}
              width={logoWidth}
              height={logoHeight}
              className="h-7 w-auto sm:h-8"
            />
          ) : (
            <>
              <span className="sr-only">{siteName}</span>
              <span aria-hidden="true">
                KOOL<span className="text-cta">·</span>K
              </span>
            </>
          )}
        </Link>

        {/* ── DESKTOP LINKS ───────────────────────────────────────────────  */}
        <ul className="ml-6 hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-ink-muted hover:text-ink text-small font-bold transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Pushes the CTA cluster to the right at every size. */}
        <div className="ml-auto flex items-center gap-2">
          {/* ── THE PRIMARY CTA ─────────────────────────────────────────────
              Visible at every breakpoint, never inside the menu. The label
              shortens below 400px so it survives a 320px screen without
              wrapping or pushing the toggle off the edge. */}
          <Link
            href={primary.href}
            className="bg-cta text-cta-ink hover:bg-brand hover:text-ice inline-flex items-center rounded-full px-4 py-2.5 text-sm font-extrabold whitespace-nowrap transition-colors sm:px-5"
          >
            <span className="hidden min-[400px]:inline">
              {primary.label}
            </span>
            <span className="min-[400px]:hidden">Sponsor</span>
          </Link>

          {/* ── MOBILE TOGGLE ───────────────────────────────────────────── */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            className="border-rule text-ink hover:border-ice grid size-11 shrink-0 place-items-center rounded-full border transition-colors md:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              {open ? (
                <>
                  <path d="M5 5l10 10" />
                  <path d="M15 5L5 15" />
                </>
              ) : (
                <>
                  <path d="M3 6h14" />
                  <path d="M3 10h14" />
                  <path d="M3 14h14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* ── MOBILE PANEL ──────────────────────────────────────────────────
          Rendered immediately after the toggle in the DOM so Tab order is
          natural, and anchored to the BOTTOM of the viewport so the links
          land under the thumb. Not a modal, not a focus trap. */}
      <div
        ref={panelRef}
        id={panelId}
        className={[
          "fixed inset-x-0 bottom-0 z-50 md:hidden",
          "border-rule bg-surface-2 border-t",
          "transition-[transform,opacity] duration-250 ease-out",
          "motion-reduce:transition-none",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0",
        ].join(" ")}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        // Closed panel is inert, so its links are not tabbable while it is off
        // screen. This is the only `inert` here — the page behind an OPEN
        // panel is deliberately left reachable, because this is a disclosure,
        // not a modal, and must not trap focus.
        aria-hidden={!open}
        inert={!open}
      >
        <ul className="px-4 py-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => close()}
                className="border-rule text-ink flex min-h-14 items-center border-b text-lg font-bold last:border-b-0"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-rule border-t px-4 py-4">
          <a
            href={`tel:+${phoneE164}`}
            className="text-ink-muted text-small block font-bold"
          >
            {phoneDisplay}
          </a>
          <a
            href={`mailto:${email}`}
            className="text-ink-muted text-small mt-1 block break-all font-bold"
          >
            {email}
          </a>
        </div>
      </div>
    </header>
  );
}

export default StickyNav;
