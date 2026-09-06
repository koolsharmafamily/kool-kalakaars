"use client";

import { useEffect, useState } from "react";
import siteConfig from "@/content/site.config";
import {
  getCountdownState,
  formatEventDate,
  type CountdownState,
} from "@/lib/countdown";

/**
 * COUNTDOWN
 * =========
 * Handles all four states, and reserves the same vertical space in every one
 * of them so switching between them can never shift the page.
 *
 * ── WHY THE FIRST RENDER IS DELIBERATELY BLANK ──────────────────────────────
 * The server renders this at build time. The browser renders it whenever
 * someone visits. Those are different moments, so any live digit computed on
 * the server would disagree with the client and trip a hydration mismatch.
 *
 * So the ticking numbers only ever come from `useEffect`, which runs after
 * mount and only in the browser. The first paint shows the digit frames with
 * placeholder glyphs at the exact final size — no reflow when the real numbers
 * land a frame later.
 *
 * The non-ticking states (unset, invalid, past) do not have this problem and
 * render identically on both sides.
 */

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
] as const;

function Digits({ value }: { value: number | null }) {
  // Two characters wide always, so 9 -> 09 and the box never resizes.
  const text = value === null ? "––" : String(value).padStart(2, "0");
  return (
    <span className="font-display text-cta text-4xl leading-none tabular-nums sm:text-5xl">
      {text}
    </span>
  );
}

export function Countdown({ className = "" }: { className?: string }) {
  const { event } = siteConfig;

  // Computed once on the server (never "counting"), then re-derived on the
  // client every second.
  const [state, setState] = useState<CountdownState>(() =>
    getCountdownState(event.startsAt, 0),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const tick = () => setState(getCountdownState(event.startsAt, Date.now()));
    tick();

    // Only run a timer when something is actually counting down. An unset or
    // finished event does not need an interval running forever.
    const initial = getCountdownState(event.startsAt, Date.now());
    if (initial.status !== "counting") return;

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [event.startsAt]);

  /* ── NO DATE YET, OR A DATE NOBODY CAN READ ───────────────────────────────
     A mistyped date is shown to visitors as "announcing soon" rather than as
     an error — but it is logged in development so it gets noticed. */
  if (state.status === "unset" || state.status === "invalid") {
    if (state.status === "invalid" && process.env.NODE_ENV !== "production") {
      console.warn(
        `[Kool Kalakaars] event.startsAt is not a readable date: "${state.raw}". ` +
          `Expected something like "2026-12-19T18:30:00+05:30". ` +
          `Showing "${event.dateTbcLabel}" instead.`,
      );
    }

    return (
      <div className={className}>
        <p className="font-display text-d3 text-ink">{event.dateTbcLabel}</p>
        <p className="text-small text-ink mt-2">{event.recurrence}</p>
      </div>
    );
  }

  /* ── THE NIGHT HAS BEEN AND GONE ────────────────────────────────────────── */
  if (state.status === "past") {
    return (
      <div className={className}>
        <p className="font-display text-d3 text-ink">{event.postEventMessage}</p>
        <p className="text-small text-ink mt-2">{event.recurrence}</p>
      </div>
    );
  }

  /* ── COUNTING ───────────────────────────────────────────────────────────── */
  const readable = formatEventDate(event.startsAt);

  return (
    <div className={className}>
      {/* One spoken sentence for screen readers instead of eight disconnected
          numbers and labels. aria-hidden on the visual grid below avoids
          reading it twice. The live region is off — a value that changes every
          second must never be announced continuously. */}
      <p className="sr-only" aria-live="off">
        {`${state.days} days, ${state.hours} hours and ${state.minutes} minutes until the event` +
          (readable ? ` on ${readable}` : "")}
      </p>

      <ul
        aria-hidden="true"
        className="flex items-start justify-center gap-3 sm:gap-5"
      >
        {UNITS.map((u) => (
          <li key={u.key} className="min-w-16 text-center sm:min-w-20">
            <Digits value={mounted ? state[u.key] : null} />
            <span className="text-micro text-ink mt-2 block font-bold uppercase">
              {u.label}
            </span>
          </li>
        ))}
      </ul>

      {readable ? (
        <p className="text-small text-ink mt-4 text-center font-bold">
          {readable} IST
        </p>
      ) : null}
    </div>
  );
}

export default Countdown;
