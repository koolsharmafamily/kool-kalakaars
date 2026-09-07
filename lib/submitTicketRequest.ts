import type { TicketFields, FieldErrors } from "@/lib/validation";

/**
 * submitTicketRequest
 * ===================
 * THE SINGLE SWAP POINT.
 *
 * The form component knows about this function and nothing else — not the
 * endpoint, not Google, not the transport. Moving to Formspree, Resend or a
 * real database means rewriting this file and `forwardToSheet` in
 * app/api/ticket/route.ts. No component changes.
 *
 * Every failure is returned as a value rather than thrown, so the caller
 * handles one shape and there is no path where an unhandled rejection leaves
 * the button spinning forever.
 */

export type SubmitResult =
  | { ok: true }
  | {
      ok: false;
      /**
       * `validation` means the visitor can fix it. Everything else is our
       * problem, and the form offers WhatsApp instead.
       */
      kind: "validation" | "rate_limited" | "server" | "network";
      fieldErrors?: FieldErrors;
    };

export async function submitTicketRequest(
  fields: TicketFields,
  meta: { elapsed: number; website: string },
): Promise<SubmitResult> {
  let res: Response;

  try {
    res = await fetch("/api/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, ...meta }),
    });
  } catch {
    // Offline, DNS failure, request blocked. Nothing reached us.
    return { ok: false, kind: "network" };
  }

  let body: { ok?: boolean; error?: string; fieldErrors?: FieldErrors };
  try {
    body = await res.json();
  } catch {
    return { ok: false, kind: "server" };
  }

  if (res.ok && body.ok) return { ok: true };

  if (res.status === 400 && body.error === "validation") {
    return { ok: false, kind: "validation", fieldErrors: body.fieldErrors };
  }

  if (res.status === 429) return { ok: false, kind: "rate_limited" };

  return { ok: false, kind: "server" };
}
