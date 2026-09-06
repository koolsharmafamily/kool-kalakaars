/**
 * SECTION HEADING
 * ===============
 * The eyebrow-plus-heading pair every section opens with.
 *
 * ── THE lang ATTRIBUTE MATTERS HERE ─────────────────────────────────────────
 * The eyebrows are Devanagari. Without `lang="hi"` a screen reader set to an
 * English voice will attempt those glyphs with English phonetics and produce
 * noise. Tagging the span lets assistive tech switch to a Hindi voice for
 * exactly those words and switch back afterwards.
 *
 * The eyebrow is decoration, but it is decoration made of real words, so it
 * gets read properly rather than hidden.
 */

export function SectionHeading({
  eyebrow,
  heading,
  tone = "dark",
  className = "",
  as: As = "h2",
}: {
  /** Devanagari flavour line. Optional. */
  eyebrow?: string;
  heading: string;
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  // On dark sections acid is the accent; on ice sections acid is unreadable
  // (1.23:1) so the accent becomes magenta, which measures 4.98:1 there.
  const accent = tone === "light" ? "text-brand" : "text-cta";

  return (
    <div className={className}>
      {eyebrow ? (
        <p className={`text-eyebrow font-bold ${accent}`}>
          <span lang="hi">{eyebrow}</span>
        </p>
      ) : null}
      <As className="font-display text-d1 mt-4 uppercase">{heading}</As>
    </div>
  );
}

export default SectionHeading;
