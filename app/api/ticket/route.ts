import { NextResponse } from "next/server";
import siteConfig from "@/content/site.config";
import { validateTicket, hasErrors, toPayload } from "@/lib/validation";

/**
 * TICKET REQUEST PROXY
 * ====================
 * The browser posts here; this forwards to the Google Apps Script web app.
 *
 * ── WHY THIS EXISTS RATHER THAN POSTING STRAIGHT TO GOOGLE ──────────────────
 *
 * 1. APPS SCRIPT RETURNS 200 WHEN IT FAILS.
 *    A web app whose script has no doPost still answers with HTTP 200 and an
 *    HTML page reading "Script function not found: doPost". A browser calling
 *    it directly and checking `response.ok` would see success and tell the
 *    visitor their seat was booked, while nothing was written anywhere. That
 *    is the single worst failure this form could have, and it is the default
 *    behaviour. So success is decided by PARSING THE BODY, never the status.
 *
 * 2. CORS. Apps Script 302-redirects to script.googleusercontent.com, so any
 *    preflighted browser request fails. Server to server, there is no
 *    preflight and no CORS at all.
 *
 * 3. Spam. A public endpoint that writes to a spreadsheet attracts bots, so
 *    there is a honeypot, a minimum fill time, and per-IP rate limiting here.
 *
 * 4. The endpoint URL stays out of the page source.
 *
 * Swapping to Formspree, Resend or a database means rewriting only the
 * `forwardToSheet` function below. Nothing in the UI knows where this goes.
 */

/** Apps Script can be slow to wake. Long enough to be fair, short enough to fail visibly. */
const UPSTREAM_TIMEOUT_MS = 15_000;

/** A human cannot complete four fields faster than this. Bots can. */
const MIN_FILL_MS = 2_500;

/* ── RATE LIMITING ─────────────────────────────────────────────────────────
   In-memory and therefore per-instance, which is imperfect on serverless but
   costs nothing and stops the naive flooding this will actually see. If real
   abuse ever shows up, swap this for Upstash or Vercel KV. */
const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t > RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT.max;
}

/* ── THE SWAP POINT ────────────────────────────────────────────────────────
   Everything provider-specific lives in here. */
type ForwardResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "misconfigured" | "unreachable"; detail?: string };

async function forwardToSheet(payload: Record<string, unknown>): Promise<ForwardResult> {
  // Env var wins, so the URL can be kept off the site entirely if preferred.
  const endpoint = process.env.TICKET_ENDPOINT_URL || siteConfig.links.ticketEndpoint;
  if (!endpoint) return { ok: false, reason: "not_configured" };

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      redirect: "follow",
    });
  } catch (err) {
    return {
      ok: false,
      reason: "unreachable",
      detail: err instanceof Error ? err.message : String(err),
    };
  }

  const text = await res.text();

  // THE IMPORTANT BIT. Apps Script answers 200 with an HTML error page when
  // the script has no doPost, or when the script throws. Anything that is not
  // JSON we are able to read is treated as a failure, whatever the status was.
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    const looksLikeMissingHandler = /Script function not found/i.test(text);
    return {
      ok: false,
      reason: "misconfigured",
      detail: looksLikeMissingHandler
        ? "The Apps Script web app has no doPost function. See docs/APPS_SCRIPT.md."
        : `Endpoint returned ${res.status} but not JSON (${text.slice(0, 120)})`,
    };
  }

  const body = parsed as { ok?: boolean; result?: string; error?: string };
  const succeeded = body.ok === true || body.result === "success";

  if (!succeeded) {
    return {
      ok: false,
      reason: "misconfigured",
      detail: body.error ?? "Endpoint replied with JSON but did not report success.",
    };
  }

  return { ok: true };
}

/* ── HANDLER ───────────────────────────────────────────────────────────── */

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let raw: Record<string, string>;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: a real person never fills a field they cannot see. Answer with a
  // cheerful 200 so a bot has no signal that it was caught.
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Submitted implausibly fast. Same silent treatment.
  const elapsed = Number(raw.elapsed);
  if (Number.isFinite(elapsed) && elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  // Revalidate server-side. The browser already did this, but the browser is
  // not something we control.
  const fields = {
    name: String(raw.name ?? ""),
    phone: String(raw.phone ?? ""),
    email: String(raw.email ?? ""),
    seats: String(raw.seats ?? ""),
  };

  const errors = validateTicket(fields, siteConfig.copy.tickets.maxSeats);
  if (hasErrors(errors)) {
    return NextResponse.json(
      { ok: false, error: "validation", fieldErrors: errors },
      { status: 400 },
    );
  }

  const result = await forwardToSheet(toPayload(fields));

  if (!result.ok) {
    // Logged for us, never shown to the visitor — they get the WhatsApp
    // fallback instead of an internal diagnostic.
    console.error(`[ticket] ${result.reason}: ${result.detail ?? ""}`);
    return NextResponse.json(
      { ok: false, error: result.reason },
      { status: result.reason === "not_configured" ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
