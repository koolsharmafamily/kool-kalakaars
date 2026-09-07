import siteConfig from "@/content/site.config";
import PopImage from "@/components/ui/PopImage";
import Reveal from "@/components/anim/Reveal";
import PinnedTrack from "@/components/anim/PinnedTrack";

/**
 * THE THREE CATEGORIES
 * ====================
 * The most visually rich section, and the one carrying all the photography.
 *
 * ── A SERVER COMPONENT ──────────────────────────────────────────────────────
 * This used to be "use client" in its entirety, which dragged PopImage, all
 * three cards of markup and the whole 40 KB site config into the browser
 * bundle to support a dozen lines of scroll maths. The scroll behaviour now
 * lives in <PinnedTrack>, which takes children it never inspects, so
 * everything below renders on the server and arrives as HTML.
 *
 * ── TWO LAYOUTS, CHOSEN BY CSS ──────────────────────────────────────────────
 * DESKTOP (wide + fine pointer + motion allowed)
 *   A tall spacer supplies the scroll distance, a sticky child holds the
 *   viewport, and the track inside translates sideways as you scroll. The
 *   heading rides along so the whole thing reads as one moving board.
 *
 * EVERYWHERE ELSE — every phone, every tablet, anyone with reduced motion
 *   An ordinary vertical stack with staggered reveals. Nothing pinned, nothing
 *   scroll-linked, and the section is a normal height.
 *
 * The switch is a CSS media query (.kk-cat-* in globals.css), not JavaScript,
 * so it applies before first paint: no hydration mismatch, no layout shift.
 *
 * ── WHY THIS IS NOT SCROLL-JACKING ──────────────────────────────────────────
 * The page scrolls natively throughout. Nothing intercepts wheel or touch,
 * nothing calls scrollTo, no scrollbar is replaced. The horizontal movement is
 * a transform on a sticky element driven by where the page already is.
 *
 * ── ON THE IMAGES ───────────────────────────────────────────────────────────
 * Licensed stock, greyscaled at build time and coloured by PopImage. Every one
 * is a tight detail crop with no identifiable face — a recognisable band on a
 * stage would imply a Kool Kalakaars night that has not happened yet.
 */

/** Per-card treatment. Hand-tuned, not derived from the index. */
const TREATMENTS = [
  {
    sticker: "ice",
    duotone: "indigoMagenta",
    shape: "angled",
    halftone: "soft",
    rotate: -1.6,
    misregister: 0,
  },
  {
    sticker: "acid",
    duotone: "violetAcid",
    shape: "torn",
    halftone: "medium",
    rotate: 1.2,
    misregister: 0,
  },
  {
    sticker: "magenta",
    duotone: "indigoMagenta",
    shape: "angled",
    halftone: "soft",
    rotate: -0.8,
    misregister: 3,
  },
] as const;

export function Categories() {
  const { copy } = siteConfig;

  return (
    <section
      id="categories"
      /**
       * overflow-x-clip, NOT overflow-hidden.
       *
       * `overflow: hidden` turns an element into a scroll container, and
       * `position: sticky` inside a scroll container sticks to THAT container
       * rather than the viewport, so the pin silently never engages. `clip`
       * clips the same content without establishing a scroll container.
       * Do not change this back.
       */
      className="bg-surface-2 relative scroll-mt-24 overflow-x-clip"
    >
      <PinnedTrack className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        {/* Rides with the track on desktop, sits above the stack on mobile.
            Same markup either way. */}
        <Reveal className="kk-cat-intro">
          <p className="text-eyebrow text-cta font-bold">
            <span lang="hi">{copy.categories.eyebrow}</span>
          </p>
          <h2 className="font-display text-d1 mt-4 uppercase">
            {copy.categories.heading}
          </h2>
          <p className="text-lead text-ink-muted mt-6">
            Pick the one that fits what you already do. You only enter one.
          </p>
        </Reveal>

        {copy.categories.items.map((cat, i) => {
          const t = TREATMENTS[i % TREATMENTS.length];

          return (
            <Reveal
              as="div"
              key={cat.name}
              delay={120 * (i + 1)}
              className="kk-cat-card mt-14 md:mt-0"
            >
              <PopImage
                src={cat.image}
                alt={cat.imageAlt}
                width={900}
                height={1125}
                duotone={t.duotone}
                halftone={t.halftone}
                shape={t.shape}
                sticker={t.sticker}
                rotate={t.rotate}
                misregister={t.misregister}
                preGreyscaled
                sizes="(max-width: 768px) calc(100vw - 2.5rem), (max-width: 1280px) 33vw, 420px"
              />

              <div className="mt-7">
                <span
                  aria-hidden="true"
                  className="font-display text-cta text-3xl leading-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-d3 mt-3 uppercase">
                  {cat.name}
                </h3>
                <p className="text-cta text-eyebrow mt-2 font-bold uppercase">
                  {cat.qualifier}
                </p>
                <p className="text-ink-muted mt-4">{cat.blurb}</p>
              </div>
            </Reveal>
          );
        })}
      </PinnedTrack>
    </section>
  );
}

export default Categories;
