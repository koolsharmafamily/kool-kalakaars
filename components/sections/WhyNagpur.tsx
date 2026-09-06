import siteConfig from "@/content/site.config";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * WHY NAGPUR
 * ==========
 * Three cut-paper cards. No photographs here on purpose — the categories
 * section right after this one is carrying the imagery, and two picture-heavy
 * sections back to back would flatten both.
 *
 * ── NO NUMBERS ──────────────────────────────────────────────────────────────
 * Every line is something anyone in the city can verify by looking. There is
 * not a single statistic, because there is no source for one. An invented
 * figure that a sponsor checks and cannot confirm costs more credibility than
 * the figure would ever have bought.
 *
 * The offset plate behind each card is static — a screen-print colour plate
 * that did not quite line up. It is a sibling div, not a box-shadow, so it
 * costs nothing to paint and can be animated later if we want it to drift.
 */

const PLATE_COLOURS = [
  "var(--color-brand)",
  "var(--color-highlight)",
  "var(--color-cta)",
];

const CARD_SHAPE =
  "polygon(0% 3%, 3% 0%, 97% 1.5%, 100% 5%, 99% 96%, 96% 100%, 2.5% 98.5%, 0% 95%)";

export function WhyNagpur() {
  const { copy } = siteConfig;

  return (
    <section
      id="why"
      className="bg-surface relative scroll-mt-24 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow={copy.whyNagpur.eyebrow}
          heading={copy.whyNagpur.heading}
        />

        <p className="text-lead text-ink-muted mt-6 max-w-2xl">
          Three things you can see for yourself, without anybody quoting a
          number at you.
        </p>

        <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-7">
          {copy.whyNagpur.points.map((point, i) => (
            <li key={point.title} className="relative">
              {/* Misregistered colour plate. Sits behind, offset, static. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-2 translate-y-2 opacity-70"
                style={{
                  background: PLATE_COLOURS[i % PLATE_COLOURS.length],
                  clipPath: CARD_SHAPE,
                }}
              />

              <div
                className="bg-surface-2 border-rule relative flex h-full flex-col p-7"
                style={{ clipPath: CARD_SHAPE }}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-cta text-5xl leading-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="font-display text-d3 mt-5 uppercase">
                  {point.title}
                </h3>

                <p className="text-ink-muted mt-3">{point.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default WhyNagpur;
