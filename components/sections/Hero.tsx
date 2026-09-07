import siteConfig from "@/content/site.config";
import Button from "@/components/ui/Button";
import Countdown from "@/components/ui/Countdown";
import HeroBackdrop from "@/components/sections/HeroBackdrop";

/**
 * HERO
 * ====
 * Full-bleed, mobile-first. The name is set on two lines on purpose: stacked,
 * KALAKAARS fills the measure edge to edge at 360px, which is what makes it
 * read as a poster rather than a heading. It is still one <h1> and still one
 * accessible name.
 *
 * `min-h-[100svh]` rather than `100dvh`: the small-viewport unit is stable
 * whether or not the mobile URL bar is showing, so the hero never resizes
 * mid-scroll. Slightly shorter than the screen when the bar retracts, which is
 * a fair trade for zero movement.
 *
 * This section is also the scroll sentinel for the sticky nav and the floating
 * WhatsApp button — both watch `#top`.
 */

export function Hero() {
  const { site, copy, media, event } = siteConfig;

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center sm:px-8"
    >
      <HeroBackdrop />

      <div className="relative flex w-full max-w-5xl flex-col items-center">
        {/* ── LOGO SLOT ───────────────────────────────────────────────────
            The logo is still being made. This reserves the exact box a
            horizontal lockup will occupy, so dropping the real file into
            media.logo shifts nothing. Marked so nobody mistakes it for a
            finished element. */}
        {media.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.logo}
            alt={site.name}
            width={media.logoWidth}
            height={media.logoHeight}
            className="mb-8 h-16 w-auto sm:h-20"
          />
        ) : (
          <div
            className="kk-hero-item border-cta/45 text-cta/80 mb-8 grid h-16 w-full max-w-[280px] place-items-center rounded-lg border-2 border-dashed sm:h-20 sm:max-w-[320px]"
            style={{ aspectRatio: `${media.logoWidth} / ${media.logoHeight}`, ["--kk-delay"]: "0ms" } as React.CSSProperties}
          >
            <span className="text-micro font-bold uppercase">
              Logo slot · {media.logoWidth}×{media.logoHeight}
            </span>
          </div>
        )}

        {/* ── A CONTRAST RULE THAT ONLY APPLIES IN THE HERO ────────────────
            Everywhere else on the site the backdrop is a known brand colour.
            Here it will eventually be an unknown video frame, and the 72%
            indigo scrim only guarantees `ice`:

              ice   on scrim over a white frame   4.69:1   passes AA
              acid  on scrim over a white frame   3.80:1   FAILS at body size
              muted on scrim over a white frame   2.78:1   FAILS outright

            So small text in the hero is `ice`, full stop, and `acid` appears
            only at display size where the 3:1 large-text threshold applies
            (the name at 74px, the countdown digits) or on a solid fill it
            controls itself (the primary button, indigo on acid at 8.49:1).
            Hierarchy comes from weight and size instead of from dimming. */}
        <p
          className="kk-hero-item text-eyebrow text-ink font-bold tracking-[0.18em] uppercase"
          style={{ ["--kk-delay"]: "70ms" } as React.CSSProperties}
        >
          {copy.hero.eyebrow}
        </p>

        {/* ── THE NAME ────────────────────────────────────────────────────
            Two lines, tight leading. One heading, one accessible name. */}
        <h1 className="font-display text-name mt-6 w-full uppercase">
          <span className="kk-hero-name-a block">Kool</span>
          <span className="kk-hero-name-b text-cta block">Kalakaars</span>
        </h1>

        <p
          className="kk-hero-item text-lead text-ink mt-6 max-w-xl text-balance"
          style={{ ["--kk-delay"]: "260ms" } as React.CSSProperties}
        >
          {site.tagline}
        </p>

        {/* ── COUNTDOWN ───────────────────────────────────────────────────
            No reserved min-height here on purpose. Which state renders is
            decided at build time from the config, so it cannot change under a
            visitor, and within the counting state the digit boxes are a fixed
            width (9 renders as 09) so ticking never reflows. Reserving space
            for the tallest state would just punch a hole in the other three. */}
        <Countdown event={event} className="kk-hero-item mt-10" style={{ ["--kk-delay"]: "340ms" } as React.CSSProperties} />

        {/* ── THE TWO ACTIONS ─────────────────────────────────────────────
            Full-width stacked on a phone so both are easy thumb targets;
            side by side from 480px up. */}
        <div
          className="kk-hero-item mt-10 flex w-full max-w-md flex-col gap-3 min-[480px]:flex-row min-[480px]:justify-center"
          style={{ ["--kk-delay"]: "420ms" } as React.CSSProperties}
        >
          <Button
            href={copy.hero.primaryCta.href}
            variant="primary"
            size="lg"
            className="w-full min-[480px]:w-auto"
          >
            {copy.hero.primaryCta.label}
          </Button>
          <Button
            href={copy.hero.secondaryCta.href}
            variant="secondary"
            size="lg"
            className="w-full min-[480px]:w-auto"
          >
            {copy.hero.secondaryCta.label}
          </Button>
        </div>

        <p
          className="kk-hero-item text-small text-ink mt-5 font-bold"
          style={{ ["--kk-delay"]: "500ms" } as React.CSSProperties}
        >
          {copy.hero.footnote}
        </p>
      </div>
    </section>
  );
}

export default Hero;
