import Image from "next/image";
import siteConfig from "@/content/site.config";

/**
 * SPONSOR LOGOS — BUILT, WIRED, NOT RENDERING
 * ===========================================
 * Fully implemented and already placed in the sponsor section. It returns
 * `null` today because `flags.showSponsorLogos` is false and the `sponsors`
 * array is empty.
 *
 * ── WHY BOTH CONDITIONS ─────────────────────────────────────────────────────
 * The flag alone would let an empty array render an empty strip. The array
 * alone would publish a logo the moment it was added, before anyone had
 * checked it. Requiring both means logos can be staged, reviewed and then
 * switched on deliberately.
 *
 * ── WHAT THIS DELIBERATELY DOES NOT DO ──────────────────────────────────────
 * There is no placeholder row, no greyed-out boxes, no "your logo here" slot
 * and no invented client marquee. A sponsor wall with fake logos on it is
 * transparent to exactly the audience it is meant to impress, and it makes
 * every other claim on the page look negotiable.
 *
 * When it does render, logos are shown at a uniform height with the width left
 * to the natural aspect ratio, so a wide wordmark and a square mark sit
 * together without either being distorted.
 */

export function SponsorLogos({ className = "" }: { className?: string }) {
  const { sponsors, flags } = siteConfig;

  // Nothing to show. Render nothing at all — not an empty container.
  if (!flags.showSponsorLogos || sponsors.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-eyebrow text-ink-muted text-center font-bold uppercase">
        Supported by
      </h3>

      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
        {sponsors.map((sponsor) => {
          const logo = (
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              width={220}
              height={64}
              // Uniform height, natural width — no distortion between a wide
              // wordmark and a square mark.
              className="h-10 w-auto object-contain sm:h-12"
            />
          );

          return (
            <li key={sponsor.name}>
              {sponsor.url ? (
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${sponsor.name} — opens in a new tab`}
                  className="block transition-opacity hover:opacity-70"
                >
                  {logo}
                </a>
              ) : (
                logo
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SponsorLogos;
