"use client";

import { useEffect, useRef, useState } from "react";
import Field from "@/components/ui/Field";
import { submitTicketRequest } from "@/lib/submitTicketRequest";
import {
  validateTicket,
  hasErrors,
  type TicketFields,
  type FieldErrors,
} from "@/lib/validation";

/**
 * FREE TICKET — THE INTERACTIVE PART
 * ==================================
 * Everything that needs state, and nothing that does not. The heading, the
 * lead and the section framing are rendered on the server by TicketForm.
 *
 * All copy arrives as props rather than through a config import, so the client
 * bundle carries the seven strings this form actually shows instead of every
 * word on the site.
 *
 * ── NO alert() ANYWHERE ─────────────────────────────────────────────────────
 * Success and failure are both rendered into the page. `alert()` cannot be
 * styled, cannot be read back, blocks the main thread, and on mobile looks
 * like a browser malfunction rather than a confirmation.
 *
 * ── VALIDATION TIMING ───────────────────────────────────────────────────────
 * Fields validate on blur, never while typing — flagging an email as invalid
 * at "k@" is technically correct and infuriating. Once a field has an error it
 * re-validates on every keystroke, so the message clears the moment it is
 * fixed rather than making people blur the field to find out.
 *
 * ── FAILURE IS NEVER A DEAD END ─────────────────────────────────────────────
 * If the endpoint is down or misconfigured the visitor is told plainly and
 * handed the WhatsApp number, with the message prefilled. Their details stay
 * in the form so nothing has to be retyped.
 */

const EMPTY: TicketFields = { name: "", phone: "", email: "", seats: "1" };

const CARD_SHAPE =
  "polygon(0% 3%, 3% 0%, 97% 1.5%, 100% 5%, 99% 96%, 96% 100%, 2.5% 98.5%, 0% 95%)";

type Status = "idle" | "submitting" | "success" | "error";

export function TicketFormClient({
  maxSeats,
  labels,
  contact,
  siteName,
}: {
  maxSeats: number;
  labels: {
    submit: string;
    submitting: string;
    successHeading: string;
    successBody: string;
    errorHeading: string;
    errorBody: string;
    consent: string;
  };
  contact: { phoneDisplay: string; email: string; whatsappChat: string };
  siteName: string;
}) {
  const [fields, setFields] = useState<TicketFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failureKind, setFailureKind] = useState<string | null>(null);

  // Spam signals. `mountedAt` gives fill duration; `website` is a field no
  // human can see.
  const mountedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");

  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  /**
   * Move focus to whichever outcome just appeared.
   *
   * This has to be an effect, not a requestAnimationFrame after setStatus.
   * rAF can fire before React has committed the new DOM, in which case the ref
   * is still null and focus silently does not move. An effect runs after
   * commit, so the element is guaranteed to exist.
   */
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    else if (status === "error") errorRef.current?.focus();
  }, [status]);

  const setField = (key: keyof TicketFields) => (value: string) => {
    setFields((prev) => {
      const next = { ...prev, [key]: value };
      if (errors[key]) {
        const fresh = validateTicket(next, maxSeats);
        setErrors((e) => ({ ...e, [key]: fresh[key] }));
      }
      return next;
    });
  };

  const blurField = (key: keyof TicketFields) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const fresh = validateTicket(fields, maxSeats);
    setErrors((e) => ({ ...e, [key]: fresh[key] }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validateTicket(fields, maxSeats);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true, seats: true });

    if (hasErrors(found)) {
      const firstBad = (["name", "phone", "email", "seats"] as const).find(
        (k) => found[k],
      );
      if (firstBad) {
        document.querySelector<HTMLInputElement>(`[name="${firstBad}"]`)?.focus();
      }
      return;
    }

    setStatus("submitting");
    setFailureKind(null);

    const result = await submitTicketRequest(fields, {
      elapsed: Date.now() - mountedAt.current,
      website: honeypot,
    });

    if (result.ok) {
      setStatus("success");
      return;
    }

    if (result.kind === "validation" && result.fieldErrors) {
      setStatus("idle");
      setErrors(result.fieldErrors);
      return;
    }

    setStatus("error");
    setFailureKind(result.kind);
  }

  /* ── SUCCESS ─────────────────────────────────────────────────────────── */
  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border-indigo max-w-lg border-2 bg-white/70 p-8 outline-none"
        style={{ clipPath: CARD_SHAPE }}
      >
        <p className="font-display text-d2 text-brand uppercase">
          {labels.successHeading}
        </p>
        <p className="text-lead mt-4">{labels.successBody}</p>
        <p className="text-small text-ink-muted-dark mt-6">
          Nothing else to do. Keep an eye on{" "}
          <a
            href={contact.whatsappChat}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand font-bold underline underline-offset-4"
          >
            WhatsApp
          </a>{" "}
          for the details.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-lg"
      aria-describedby="ticket-consent"
    >
      {/* Honeypot. Hidden from sight and from assistive tech, but a bot filling
          every input will fill it. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 overflow-hidden"
      >
        <label htmlFor="website">Leave this empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        <Field
          label="Name"
          name="name"
          value={fields.name}
          onChange={setField("name")}
          onBlur={blurField("name")}
          error={touched.name ? errors.name : undefined}
          autoComplete="name"
          disabled={status === "submitting"}
        />

        <Field
          label="Phone"
          name="phone"
          type="tel"
          inputMode="tel"
          hint="We confirm your seat on WhatsApp."
          value={fields.phone}
          onChange={setField("phone")}
          onBlur={blurField("phone")}
          error={touched.phone ? errors.phone : undefined}
          autoComplete="tel"
          disabled={status === "submitting"}
        />

        <Field
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          value={fields.email}
          onChange={setField("email")}
          onBlur={blurField("email")}
          error={touched.email ? errors.email : undefined}
          autoComplete="email"
          disabled={status === "submitting"}
        />

        <Field
          label="Number of seats"
          name="seats"
          type="number"
          inputMode="numeric"
          hint={`Up to ${maxSeats}.`}
          min={1}
          max={maxSeats}
          value={fields.seats}
          onChange={setField("seats")}
          onBlur={blurField("seats")}
          error={touched.seats ? errors.seats : undefined}
          disabled={status === "submitting"}
        />
      </div>

      <p id="ticket-consent" className="text-small text-ink-muted-dark mt-7">
        {labels.consent}
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
        className="bg-indigo text-ice hover:bg-brand kk-springy mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-extrabold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
            />
            {labels.submitting}
          </>
        ) : (
          labels.submit
        )}
      </button>

      {/* ── ERROR ─────────────────────────────────────────────────────────── */}
      {status === "error" ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="border-brand bg-brand/10 mt-6 border-2 p-6 outline-none"
        >
          <p className="font-display text-d3 text-brand uppercase">
            {labels.errorHeading}
          </p>
          <p className="mt-2">
            {failureKind === "rate_limited"
              ? "That is a lot of requests in a short time. Give it a minute, or message us."
              : labels.errorBody}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`${contact.whatsappChat}?text=${encodeURIComponent(
                `Hello — I would like ${fields.seats} free ticket(s) for ${siteName}. My name is ${fields.name || "…"}.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo text-ice inline-flex items-center rounded-full px-6 py-3 font-extrabold"
            >
              WhatsApp {contact.phoneDisplay}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="border-indigo text-ink-dark inline-flex items-center rounded-full border-2 px-6 py-3 font-extrabold"
            >
              Email instead
            </a>
          </div>
          <p className="text-small text-ink-muted-dark mt-4">
            Your details are still in the form above — nothing to retype.
          </p>
        </div>
      ) : null}
    </form>
  );
}

export default TicketFormClient;
