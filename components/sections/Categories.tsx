import siteConfig from "@/content/site.config";
import SectionHeading from "@/components/ui/SectionHeading";
import PopImage from "@/components/ui/PopImage";

/**
 * THE THREE CATEGORIES
 * ====================
 * The most visually rich section on the page, and the only one carrying
 * photography.
 *
 * ── EACH CARD IS TREATED DIFFERENTLY ON PURPOSE ─────────────────────────────
 * Three identical cards read as a spec sheet. Varying the sticker colour, the
 * cut edge, the rotation and the duotone makes them read as three things
 * pinned to a wall — which is the cut-paper collage the brief asks for. The
 * variation is defined per card below rather than left to chance.
 *
 * ── ON THE IMAGES ───────────────────────────────────────────────────────────
 * All three are licensed stock, greyscaled at build time by
 * scripts/prepare-images.mjs and coloured here by PopImage, so none of them
 * reads as raw stock. Every one is a tight detail crop with no identifiable
 * face — a recognisable band on a stage would imply a Kool Kalakaars night
 * that has not happened yet.
 *
 * `preGreyscaled` is set because the greyscale is already baked into the file,
 * which skips the runtime CSS filter — the expensive half of the treatment on
 * a mid-range phone.
 *
 * ── STILL STATIC ────────────────────────────────────────────────────────────
 * A stacked grid for now. The pinned horizontal track on desktop and the
 * scroll-snap carousel on mobile arrive with the animation layer.
 */

/** Per-card treatment. Deliberately hand-tuned, not derived from the index. */
const TREATMENTS = [
  {
    sticker: "ice",
    duotone: "indigoMagenta",
    shape: "angled",
    halftone: "soft",
    rotate: -1.6,
    misregister: 0,
    accent: "text-cta",
  },
  {
    sticker: "acid",
    duotone: "violetAcid",
    shape: "torn",
    halftone: "medium",
    rotate: 1.2,
    misregister: 0,
    accent: "text-cta",
  },
  {
    sticker: "magenta",
    duotone: "indigoMagenta",
    shape: "angled",
    halftone: "soft",
    rotate: -0.8,
    misregister: 3,
    accent: "text-cta",
  },
] as const;

export function Categories() {
  const { copy } = siteConfig;

  return (
    <section
      id="categories"
      className="bg-surface-2 relative scroll-mt-24 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow={copy.categories.eyebrow}
          heading={copy.categories.heading}
        />

        <p className="text-lead text-ink-muted mt-6 max-w-2xl">
          Pick the one that fits what you already do. You only enter one.
        </p>

        <ul className="mt-14 grid gap-14 md:grid-cols-3 md:gap-8">
          {copy.categories.items.map((cat, i) => {
            const t = TREATMENTS[i % TREATMENTS.length];

            return (
              <li key={cat.name} className="flex flex-col">
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
                  sizes="(max-width: 768px) calc(100vw - 2.5rem), (max-width: 1280px) 33vw, 400px"
                />

                <div className="mt-7">
                  <span
                    aria-hidden="true"
                    className={`font-display text-3xl leading-none ${t.accent}`}
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
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Categories;
