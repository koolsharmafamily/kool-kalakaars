"use client";

import { useId } from "react";

/**
 * FIELD
 * =====
 * A labelled input that reports its own errors correctly.
 *
 * ── THE ACCESSIBILITY PART ──────────────────────────────────────────────────
 * A red border is not an error message. Three things have to be true for a
 * screen reader user to get the same information a sighted user gets:
 *
 *   aria-invalid        marks the control as failing
 *   aria-describedby    points at BOTH the hint and the error text, so the
 *                       error is read as part of the field rather than being
 *                       an orphaned sentence somewhere on the page
 *   role="alert"        announces the error the moment it appears
 *
 * The label is a real <label> tied by id, so tapping it focuses the input —
 * which on a phone is a materially bigger touch target.
 *
 * Errors are also prefixed with a visible "!" mark rather than relying on
 * colour alone, for anyone who cannot distinguish the red.
 */

export function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  hint,
  autoComplete,
  inputMode,
  required = true,
  min,
  max,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  required?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div>
      <label htmlFor={id} className="block font-bold">
        {label}
        {!required ? (
          <span className="text-ink-muted-dark ml-2 font-normal">optional</span>
        ) : null}
      </label>

      {hint ? (
        <p id={hintId} className="text-small text-ink-muted-dark mt-1">
          {hint}
        </p>
      ) : null}

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        inputMode={inputMode}
        min={min}
        max={max}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={[
          "mt-2 block w-full rounded-lg border-2 bg-white px-4 py-3",
          "text-ink-dark placeholder:text-ink-muted-dark",
          "transition-colors outline-none",
          "disabled:opacity-60",
          error
            ? "border-brand"
            : "border-indigo/25 focus:border-indigo",
        ].join(" ")}
      />

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-small text-brand mt-2 flex gap-1.5 font-bold"
        >
          {/* Not colour alone — there is a visible mark too. */}
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default Field;
