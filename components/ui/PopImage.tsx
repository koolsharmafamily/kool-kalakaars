import Image, { type StaticImageData } from "next/image";

/**
 * POP IMAGE
 * =========
 * Every photograph on the site goes through here, so no stock image ever
 * appears raw and the treatment is identical everywhere. Swapping in real
 * event photos later is a one-line change per image.
 *
 * ── HOW THE TREATMENT IS BUILT ──────────────────────────────────────────────
 * Duotone is done with CSS blend layers over a greyscale source, NOT with an
 * SVG filter. SVG filters rasterise expensively on mid-range Android and
 * cannot be GPU-composited; blend layers can. It also means the tones read
 * from CSS custom properties, so changing the palette re-tones every photo on
 * the site without touching a single image file.
 *
 * The stack, bottom to top:
 *   1. misregistration plates   offset solid shapes (optional)
 *   2. sticker border           coloured ground, clipped
 *   3. the image                next/image, greyscaled
 *   4. duotone shadow layer     dark tone, mix-blend-mode: lighten
 *   5. duotone highlight layer  light tone, mix-blend-mode: darken
 *   6. halftone dots            tiled radial-gradient, mix-blend-mode: overlay
 *
 * ── ZERO LAYOUT SHIFT ───────────────────────────────────────────────────────
 * `width` and `height` are required. They set an explicit aspect-ratio box, so
 * the space is reserved before a single byte of image arrives. Nothing here
 * ever reflows.
 *
 * ── PERFORMANCE NOTES ───────────────────────────────────────────────────────
 * `isolation: isolate` is load-bearing: without it the blend layers would
 * blend with the page background instead of the image. `contain: paint` keeps
 * the blending from ever forcing a repaint outside this box.
 *
 * Nothing in here is animated. Blend modes and filters are static, rasterised
 * once, and this component is never used for the LCP element — the hero uses a
 * flat scrim instead.
 */

/* ─── TREATMENT PRESETS ─────────────────────────────────────────────────── */

/**
 * Duotone pairs. Each maps image blacks to `shadow` and image whites to
 * `highlight`.
 *
 * Note on violetAcid: acid is not channel-wise lighter than violet in blue, so
 * this pairing posterises harder than indigoMagenta rather than producing a
 * smooth two-tone ramp. That is deliberate — it is the louder, more
 * screen-printed of the two. Use it sparingly.
 */
const DUOTONES = {
  indigoMagenta: { shadow: "var(--color-indigo)", highlight: "var(--color-magenta)" },
  violetAcid: { shadow: "var(--color-violet)", highlight: "var(--color-acid)" },
  indigoIce: { shadow: "var(--color-indigo)", highlight: "var(--color-ice)" },
  none: null,
} as const;

/** Cut-paper edges. Clip-path is composited, so these cost nothing to paint. */
const SHAPES = {
  none: undefined,
  /** Slightly knocked-off corners. The safe default. */
  angled:
    "polygon(0% 4%, 4% 0%, 96% 1.5%, 100% 6%, 99% 95%, 95.5% 100%, 3% 98.5%, 0% 94%)",
  /** Hand-torn edge. Loud — use on one or two images, not everywhere. */
  torn: "polygon(1% 3%, 13% 0%, 35% 3%, 58% 0.5%, 79% 3%, 100% 0%, 97.5% 22%, 100% 47%, 97% 71%, 100% 97%, 76% 100%, 51% 97%, 27% 100%, 2% 98%, 0% 74%, 3% 49%, 0% 26%)",
} as const;

const STICKER_COLORS = {
  ice: "var(--color-ice)",
  acid: "var(--color-acid)",
  magenta: "var(--color-magenta)",
} as const;

const HALFTONE_STRENGTH = {
  none: 0,
  soft: 0.18,
  medium: 0.3,
  strong: 0.45,
} as const;

/* ─── PROPS ─────────────────────────────────────────────────────────────── */

export type PopImageProps = {
  /**
   * Image source. Pass `null` and the component renders a treated placeholder
   * block at the same dimensions — which is what the site shows until real
   * photography exists. No broken image, no layout shift when it arrives.
   */
  src: string | StaticImageData | null;
  /** Required whenever src is set. Describes the picture, not the treatment. */
  alt: string;
  /** Intrinsic dimensions. Required — this is what reserves the space. */
  width: number;
  height: number;

  /** Which two brand colours the photo is mapped to. */
  duotone?: keyof typeof DUOTONES;
  /** How hard the duotone is pushed, 0 to 1. */
  intensity?: number;
  /** Halftone dot density over the top. */
  halftone?: keyof typeof HALFTONE_STRENGTH;
  /** Cut-paper edge shape. */
  shape?: keyof typeof SHAPES;
  /** Sticker border colour. Omit for no border. */
  sticker?: keyof typeof STICKER_COLORS;
  /** Sticker border thickness in pixels. */
  stickerWidth?: number;
  /** Screen-print plate offset in pixels. 0 disables it. Keep to 2-3. */
  misregister?: number;
  /** Rotation in degrees. Keep small — 1 to 4 reads as placed by hand. */
  rotate?: number;

  /**
   * Set true once the source has been run through scripts/prepare-images.mjs,
   * which bakes the greyscale in. Skips the runtime filter, which is the more
   * expensive half of the treatment on a mid-range phone.
   */
  preGreyscaled?: boolean;

  /** Pass true for an above-the-fold image so Next preloads it. */
  priority?: boolean;
  /** Responsive sizes hint. Set this whenever the image is not fixed-width. */
  sizes?: string;
  className?: string;
};

/* ─── COMPONENT ─────────────────────────────────────────────────────────── */

export function PopImage({
  src,
  alt,
  width,
  height,
  duotone = "indigoMagenta",
  intensity = 0.85,
  halftone = "soft",
  shape = "angled",
  sticker,
  stickerWidth = 10,
  misregister = 0,
  rotate = 0,
  preGreyscaled = false,
  priority = false,
  sizes,
  className = "",
}: PopImageProps) {
  const tones = DUOTONES[duotone];
  const clip = SHAPES[shape];
  const dots = HALFTONE_STRENGTH[halftone];
  const strength = Math.min(Math.max(intensity, 0), 1);

  return (
    <div
      className={`relative ${className}`}
      style={{
        // Reserves the exact box before anything loads. This is the zero-CLS
        // guarantee — the aspect ratio is known from the intrinsic dimensions.
        aspectRatio: `${width} / ${height}`,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      {/* ── 1. MISREGISTRATION PLATES ─────────────────────────────────────
          Two offset solid shapes peeking out from behind, the way a badly
          registered screen print shows its colour plates. Cheap: no extra
          copies of the image, just two clipped divs. */}
      {misregister > 0 ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: "var(--color-magenta)",
              clipPath: clip,
              transform: `translate(${-misregister}px, ${misregister}px)`,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: "var(--color-highlight)",
              clipPath: clip,
              transform: `translate(${misregister}px, ${-misregister}px)`,
            }}
          />
        </>
      ) : null}

      {/* ── 2. STICKER GROUND ─────────────────────────────────────────────
          A coloured ground with padding. The inner frame is clipped to the
          same shape, so the padding reads as a cut-paper border rather than
          a CSS outline. */}
      <div
        className="absolute inset-0"
        style={{
          background: sticker ? STICKER_COLORS[sticker] : undefined,
          clipPath: clip,
          padding: sticker ? stickerWidth : 0,
        }}
      >
        {/* ── 3-6. THE TREATED FRAME ──────────────────────────────────────
            `isolation: isolate` is what keeps the blend layers blending with
            the image instead of the page behind it. `contain: paint` stops
            the blending from ever forcing a repaint outside this box. */}
        <div
          className="relative size-full overflow-hidden"
          style={{
            clipPath: clip,
            isolation: "isolate",
            contain: "paint",
          }}
        >
          {src ? (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              priority={priority}
              sizes={sizes}
              className="size-full object-cover"
              style={{
                // Static filter, rasterised once, never animated. Set
                // preGreyscaled once the source is baked greyscale and this
                // disappears entirely.
                filter: preGreyscaled ? undefined : "grayscale(1) contrast(1.15)",
              }}
            />
          ) : (
            /* No photography yet. A treated placeholder at the same box, so
               the layout is final before the real image exists. */
            <div
              aria-hidden="true"
              className="size-full"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-violet) 0%, var(--color-indigo) 55%, var(--color-magenta) 100%)",
              }}
            />
          )}

          {/* Duotone shadow plate: lifts the blacks to the dark tone. */}
          {tones ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: tones.shadow,
                mixBlendMode: "lighten",
                opacity: strength,
              }}
            />
          ) : null}

          {/* Duotone highlight plate: pulls the whites down to the light tone. */}
          {tones ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: tones.highlight,
                mixBlendMode: "darken",
                opacity: strength,
              }}
            />
          ) : null}

          {/* Halftone dots. A tiled radial-gradient — no image asset, no
              network cost, tiles to any size. */}
          {dots > 0 ? (
            <div
              aria-hidden="true"
              className="halftone pointer-events-none absolute inset-0 text-black"
              style={{ mixBlendMode: "overlay", opacity: dots }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default PopImage;
