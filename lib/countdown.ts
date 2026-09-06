/**
 * COUNTDOWN LOGIC
 * ===============
 * Pure functions, no React, no Date.now() captured at module scope — the
 * current time is always passed in. That keeps this testable and, more
 * importantly, keeps the server and the client from disagreeing about what
 * time it is during hydration.
 *
 * There are FOUR outcomes, not three. The brief names three (future, past,
 * unset); the fourth is a date that someone has typed incorrectly. A typo in
 * the config must never render "NaN days" on a live site, so a value that
 * cannot be parsed is treated exactly like no date at all.
 */

export type CountdownState =
  | { status: "unset" }
  | { status: "invalid"; raw: string }
  | { status: "past"; target: number }
  | {
      status: "counting";
      target: number;
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
      /** Total milliseconds remaining, for anything that wants finer detail. */
      remaining: number;
    };

const MS = { second: 1000, minute: 60_000, hour: 3_600_000, day: 86_400_000 };

/**
 * Works out what the countdown should be showing.
 *
 * @param startsAt ISO 8601 string with an offset, e.g. "2026-12-19T18:30:00+05:30".
 *                 Pass null when no date has been announced.
 * @param now      Current time in milliseconds. Always passed in explicitly.
 */
export function getCountdownState(
  startsAt: string | null | undefined,
  now: number,
): CountdownState {
  if (!startsAt) return { status: "unset" };

  const target = Date.parse(startsAt);

  // Date.parse returns NaN for anything it cannot read. This is the guard that
  // stops a mistyped config from putting "NaN" on the page.
  if (Number.isNaN(target)) return { status: "invalid", raw: startsAt };

  const remaining = target - now;

  if (remaining <= 0) return { status: "past", target };

  return {
    status: "counting",
    target,
    remaining,
    days: Math.floor(remaining / MS.day),
    hours: Math.floor((remaining % MS.day) / MS.hour),
    minutes: Math.floor((remaining % MS.hour) / MS.minute),
    seconds: Math.floor((remaining % MS.minute) / MS.second),
  };
}

/**
 * True when the countdown should be rendering live digits. Everything else —
 * unset, invalid, past — is a static message and needs no ticking timer.
 */
export function isCounting(
  state: CountdownState,
): state is Extract<CountdownState, { status: "counting" }> {
  return state.status === "counting";
}

/**
 * The event date written out for humans, in India Standard Time.
 * Returns null when there is nothing sensible to show.
 */
export function formatEventDate(startsAt: string | null | undefined): string | null {
  if (!startsAt) return null;
  const t = Date.parse(startsAt);
  if (Number.isNaN(t)) return null;

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(t));
}
