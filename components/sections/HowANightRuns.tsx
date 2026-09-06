import siteConfig from "@/content/site.config";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * HOW A NIGHT RUNS
 * ================
 * Five numbered steps as a vertical timeline. This is the section that does
 * the most work for sponsors — it is the evidence that somebody has actually
 * thought the evening through, which is exactly what a first-time sponsor is
 * looking for when there is no past event to point at.
 *
 * The connecting rail is a single absolutely-positioned div behind the list
 * rather than a border on each item, so the line runs continuously and stops
 * cleanly at the last number instead of dangling past it.
 *
 * The scroll-linked progressive reveal comes with the animation layer. The
 * markup is already ordered so that reveal is a matter of staggering the
 * existing list items — no restructuring needed.
 */

export function HowANightRuns() {
  const { copy } = siteConfig;
  const steps = copy.format.steps;

  return (
    <section
      id="format"
      className="bg-surface relative scroll-mt-24 overflow-hidden"
    >
      <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow={copy.format.eyebrow}
          heading={copy.format.heading}
        />

        <p className="text-lead text-ink-muted mt-6 max-w-2xl">
          Entries to encore, and what happens after the room empties.
        </p>

        <ol className="relative mt-14">
          {/* The rail. Sits behind the numbers and stops at the last one. */}
          <div
            aria-hidden="true"
            className="bg-rule absolute top-3 bottom-14 left-6 w-px sm:left-8"
          />

          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 pb-12 last:pb-0 sm:gap-8">
              {/* Number badge. Opaque so the rail passes behind it, not through. */}
              <span
                aria-hidden="true"
                className="bg-surface border-cta text-cta font-display relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 text-xl leading-none sm:size-16 sm:text-2xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="pt-2 sm:pt-4">
                <h3 className="font-display text-d3 uppercase">
                  {/* The number is decorative above; screen readers get it here
                      as part of an ordered list, which is where it belongs. */}
                  {step.title}
                </h3>
                <p className="text-ink-muted mt-3 max-w-xl">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowANightRuns;
