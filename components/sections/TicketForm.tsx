"use client";

import { useEffect, useRef, useState } from "react";
import siteConfig from "@/content/site.config";
import SectionHeading from "@/components/ui/SectionHeading";
import Field from "@/components/ui/Field";
import { submitTicketRequest } from "@/lib/submitTicketRequest";
import {
  validateTicket,
  hasErrors,
  type TicketFields,
  type FieldErrors,
} from "@/lib/validation";

/**
 * FREE TICKET FORM
 * ================
 * Entry is free. This exists so the founder knows how many chairs to put out.
 *
 * ── NO alert() ANYWHERE ─────────────────────────────────────────────────────
 * Success and failure are both rendered into the page. `alert()` cannot be
 * styled, cannot be read back, blocks the main thread, and on mobile looks
 * like a browser malfunction rather than a confirmation.
 *
 * ── VALIDATION TIMING ───────────────────────────────────────────────────────
 * Fields are validated on blur, never while typing — flagging an email as
 * invalid at "k@" is technically correct and infuriating. Once a field has an
 * error it re-validates on every keystroke, so the message clears the instant
 * it is fixed rather than making people blur the field to find out.
 *
 * ── FAILURE IS NEVER A DEAD END ─────────────────────────────────────────────
 * If the endpoint is down or misconfigured, the visitor is told plainly and
 * handed the WhatsApp number. Their details are still in the form so nothing
 * has to be retyped.
 */

const EMPTY: TicketFields = { name: "", phone: "", email: "", seats: "1" };

type Status = "idle" | "submitting" | "success" | "error";

export function TicketForm() {
  const { copy, contact, links } = siteConfig;
  const t = copy.tickets;

  const [fields, setFields] = useState<TicketFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failureKind, setFailureKind] = useState<string | null>(null);

  // Spam signals. `mountedAt` gives us fill duration; `website` is a field no
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
   * is still null and focus silently does not move — which is exactly what
   * happened the first time this was written. An effect runs after commit, so
   * the element is guaranteed to exist.
   *
   * role="status" and role="alert" announce the outcome on their own; moving
   * focus is what stops a keyboard user being left on a button whose result
   * they cannot see.
   */
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    else if (status === "error") errorRef.current?.focus();
  }, [status]);

  const setField = (key: keyof TicketFields) => (value: string) => {
    setFields((prev) => {
      const next = { ...prev, [key]: value };
      // Re-validate as they type ONLY once the field is already in error, so
      // a fixed mistake clears immediately.
      if (errors[key]) {
        const fresh = validateTicket(next, t.maxSeats);
        setErrors((e) => ({ ...e, [key]: fresh[key] }));
      }
      return next;
    });
  };

  const blurField = (key: keyof TicketFields) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const fresh = validateTicket(fields, t.maxSeats);
    setErrors((e) => ({ ...e, [key]: fresh[key] }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validateTicket(fields, t.maxSeats);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true, seats: true });

    if (hasErrors(found)) {
      // Send focus to the first thing that is actually wrong.
      const firstBad = (["name", "phone", "email", "seats"] as const).find(
        (k) => found[k],
      );
      if (firstBad) {
        document
          .querySelector<HTMLInputElement>(`[name="${firstBad}"]`)
          ?.focus();
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

  /* ── SUCCESS ─────────────────────────────────────────────────────────────
     Replaces the form in place. The page does not navigate, so nothing is
     lost and the confirmation cannot be missed. */
  if (status === "success") {
    return (
      <Section>
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="border-indigo bg-white/70 max-w-lg border-2 p-8 outline-none"
          style={{ clipPath: CARD_SHAPE }}
        >
          <p className="font-display text-d2 text-brand uppercase">
            {t.successHeading}
          </p>
          <p className="text-lead mt-4">{t.successBody}</p>
          <p className="text-small text-ink-muted-dark mt-6">
            Nothing else to do. Keep an eye on{" "}
            <a
              href={links.whatsappChat}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-bold underline underline-offset-4"
            >
              WhatsApp
            </a>{" "}
            for the details.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-lg"
        aria-describedby="ticket-consent"
      >
        {/* Honeypot. Hidden from sight and from assistive tech, but a bot
            filling every input will fill it. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
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
            hint={`Up to ${t.maxSeats}.`}
            min={1}
            max={t.maxSeats}
            value={fields.seats}
            onChange={setField("seats")}
            onBlur={blurField("seats")}
            error={touched.seats ? errors.seats : undefined}
            disabled={status === "submitting"}
          />
        </div>

        <p id="ticket-consent" className="text-small text-ink-muted-dark mt-7">
          {t.consent}
        </p>

        <button
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="bg-indigo text-ice hover:bg-brand mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
              />
              {t.submittingLabel}
            </>
          ) : (
            t.submitLabel
          )}
        </button>

        {/* ── ERROR ──────────────────────────────────────────────────────────
            Says what happened, then gives a route that definitely works. The
            form above keeps everything they typed. */}
        {status === "error" ? (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="border-brand bg-brand/10 mt-6 border-2 p-6 outline-none"
          >
            <p className="font-display text-d3 text-brand uppercase">
              {t.errorHeading}
            </p>
            <p className="mt-2">
              {failureKind === "rate_limited"
                ? "That is a lot of requests in a short time. Give it a minute, or message us."
                : t.errorBody}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`${links.whatsappChat}?text=${encodeURIComponent(
                  `Hello — I would like ${fields.seats} free ticket(s) for ${siteConfig.site.name}. My name is ${fields.name || "…"}.`,
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
    </Section>
  );
}

/* ── SHELL ─────────────────────────────────────────────────────────────────
   Shared between the form and the success state so the section framing does
   not jump when one replaces the other. */

const CARD_SHAPE =
  "polygon(0% 3%, 3% 0%, 97% 1.5%, 100% 5%, 99% 96%, 96% 100%, 2.5% 98.5%, 0% 95%)";

function Section({ children }: { children: React.ReactNode }) {
  const { copy } = siteConfig;
  return (
    <section
      id="tickets"
      // Keeps the floating WhatsApp button off the form fields.
      data-fab-avoid=""
      className="bg-surface-light text-ink-dark relative scroll-mt-24 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="halftone-lg text-brand pointer-events-none absolute -top-12 -right-20 h-72 w-72 opacity-20"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow={copy.tickets.eyebrow}
          heading={copy.tickets.heading}
          tone="light"
        />
        <p className="text-lead mt-6 max-w-2xl">{copy.tickets.lead}</p>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export default TicketForm;
