import siteConfig from "@/content/site.config";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * THE IDEA
 * ========
 * The one paragraph a journalist copies and pastes, so it is set large, on an
 * ice ground, with nothing competing with it. Deliberately the quietest
 * section on the page — the restraint is the design.
 *
 * Currently 32 words against a 40-word ceiling.
 *
 * Contrast on the ice ground:
 *   indigo body text   10.48:1   AAA
 *   magenta eyebrow     4.98:1   AA
 */

export function Idea() {
  const { copy } = siteConfig;

  return (
    <section
      id="idea"
      className="bg-surface-light text-ink-dark relative scroll-mt-24 overflow-hidden"
    >
      {/* Halftone bleeding in from the right edge, well clear of the text. */}
      <div
        aria-hidden="true"
        className="halftone-lg text-brand pointer-events-none absolute -top-10 -right-16 h-72 w-72 opacity-25"
      />

      <div className="relative mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow={copy.idea.eyebrow}
          heading={copy.idea.heading}
          tone="light"
        />

        <p className="mt-8 text-[clamp(1.375rem,4.2vw,2.25rem)] leading-[1.32] font-medium text-balance">
          {copy.idea.body}
        </p>
      </div>
    </section>
  );
}

export default Idea;
