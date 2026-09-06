import siteConfig from "@/content/site.config";
import SectionHeading from "@/components/ui/SectionHeading";
import LazyMap from "@/components/ui/LazyMap";
import Button from "@/components/ui/Button";

/**
 * THE VENUE
 * =========
 * On the ice ground for two reasons: it gives the page a light beat between
 * two dark sections, and Google's map tiles are bright, so a light section is
 * the one place a map does not read as a hole punched in the page.
 *
 * The address is written out as a real <address> element as well as being in
 * the map, so it is selectable, copyable and readable by a screen reader
 * without anyone having to enter the iframe.
 *
 * Nothing here claims more about the partnership than "hosted at". The venue
 * has approved the partnership, not endorsed any particular wording, so the
 * copy stays factual and modest.
 */

export function Venue() {
  const { venue, copy } = siteConfig;

  return (
    <section
      id="venue"
      className="bg-surface-light text-ink-dark relative scroll-mt-24 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow={copy.venue.eyebrow}
          heading={copy.venue.heading}
          tone="light"
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* ── DETAILS ──────────────────────────────────────────────────── */}
          <div>
            <h3 className="font-display text-d2 uppercase">{venue.name}</h3>

            <address className="text-lead mt-5 not-italic">
              {venue.street}
              <br />
              {venue.city}, {venue.region}
            </address>

            <p className="text-ink-muted-dark mt-7 max-w-md">{venue.note}</p>

            <Button
              href={venue.mapLinkUrl}
              external
              variant="onLight"
              className="mt-8"
            >
              Open in Google Maps
            </Button>
          </div>

          {/* ── MAP ──────────────────────────────────────────────────────── */}
          <LazyMap />
        </div>
      </div>
    </section>
  );
}

export default Venue;
