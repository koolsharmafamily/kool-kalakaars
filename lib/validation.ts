/**
 * TICKET FORM VALIDATION
 * ======================
 * Pure functions, no React, no DOM. The same module runs in the browser for
 * inline feedback and again on the server in the route handler, so a bad
 * payload cannot reach the spreadsheet just because someone bypassed the UI.
 *
 * Deliberately hand-written rather than Zod: this is four fields, and Zod plus
 * a resolver is around 25kb gzipped for what fits in a page of code. If a
 * second complex form ever appears, that is the moment to add a library.
 *
 * ── ON PHONE NUMBERS ────────────────────────────────────────────────────────
 * Indian mobile numbers are ten digits starting 6, 7, 8 or 9. People type them
 * with +91, with 0, with spaces and with dashes, and all of those are the same
 * number. So we strip everything that is not a digit, peel off a leading 91 or
 * 0, and validate what is left. Rejecting a correct number because of a space
 * is a self-inflicted wound on a form whose whole job is to be easy.
 */

export type TicketFields = {
  name: string;
  phone: string;
  email: string;
  seats: string;
};

export type FieldErrors = Partial<Record<keyof TicketFields, string>>;

/** Strips formatting and the country code, returning the bare 10 digits. */
export function normalisePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

/**
 * Intentionally permissive. Strict RFC 5322 matching rejects addresses that
 * genuinely work, and the real check is whether the message arrives.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateTicket(
  fields: TicketFields,
  maxSeats: number,
): FieldErrors {
  const errors: FieldErrors = {};

  const name = fields.name.trim();
  if (!name) errors.name = "Please tell us your name.";
  else if (name.length < 2) errors.name = "That looks too short to be a name.";
  else if (name.length > 80) errors.name = "Please keep this under 80 characters.";

  const phone = normalisePhone(fields.phone);
  if (!fields.phone.trim()) errors.phone = "We need a number to confirm your seat.";
  else if (phone.length !== 10)
    errors.phone = "Please enter a 10-digit mobile number.";
  else if (!/^[6-9]/.test(phone))
    errors.phone = "Indian mobile numbers start with 6, 7, 8 or 9.";

  const email = fields.email.trim();
  if (!email) errors.email = "We need an email address.";
  else if (!EMAIL.test(email)) errors.email = "That does not look like an email address.";
  else if (email.length > 120) errors.email = "That address is too long.";

  const seats = Number(fields.seats);
  if (!fields.seats) errors.seats = "How many seats?";
  else if (!Number.isInteger(seats)) errors.seats = "Whole numbers only.";
  else if (seats < 1) errors.seats = "At least one seat.";
  else if (seats > maxSeats)
    errors.seats = `Up to ${maxSeats} seats per request. Message us if you need more.`;

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** The shape actually sent onward, once validation has passed. */
export function toPayload(fields: TicketFields) {
  return {
    name: fields.name.trim(),
    phone: normalisePhone(fields.phone),
    email: fields.email.trim().toLowerCase(),
    seats: Number(fields.seats),
  };
}
