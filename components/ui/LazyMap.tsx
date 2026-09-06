import siteConfig from "@/content/site.config";

/**
 * LAZY MAP
 * ========
 * A Google Maps embed that cannot hurt the page load.
 *
 * ── HOW IT STAYS OUT OF THE CRITICAL PATH ───────────────────────────────────
 * `loading="lazy"` means the iframe is not fetched until it is near the
 * viewport, and the map sits well below the fold. The aspect-ratio box around
 * it is fixed, so the space is reserved from first paint and the iframe
 * arriving later shifts nothing — an unreserved iframe is one of the most
 * common sources of layout shift on a page like this.
 *
 * ── STYLING A THIRD-PARTY IFRAME ────────────────────────────────────────────
 * We cannot restyle Google's map itself. So instead of fighting it, the map is
 * framed: a cut-paper border in the brand palette, with the address and the
 * open-in-maps action rendered by us in brand type underneath. The light map
 * tiles sit deliberately on the ice section, where a bright rectangle reads as
 * intentional rather than as a hole punched in a dark page.
 *
 * A `title` on the iframe is required — without one a screen reader announces
 * it as an unlabelled frame. The address is also written out in real text
 * above it, so the location is never locked inside an iframe nobody can read.
 */

const FRAME_SHAPE =
  "polygon(0% 2%, 2% 0%, 98% 1%, 100% 4%, 99.5% 97%, 97% 100%, 2% 99%, 0% 96%)";

export function LazyMap({ className = "" }: { className?: string }) {
  const { venue } = siteConfig;

  return (
    <div className={`relative ${className}`}>
      {/* Misregistered plate behind the frame. */}
      <div
        aria-hidden="true"
        className="bg-brand absolute inset-0 translate-x-2 translate-y-2"
        style={{ clipPath: FRAME_SHAPE }}
      />

      {/* Cut-paper frame. The padding is the visible border. */}
      <div
        className="bg-indigo relative p-2.5"
        style={{ clipPath: FRAME_SHAPE }}
      >
        {/* Fixed ratio: the space is reserved before the iframe loads. */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "4 / 3" }}
        >
          <iframe
            src={venue.mapEmbedUrl}
            title={`Map showing ${venue.name}, ${venue.street}, ${venue.city}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full border-0"
          />
        </div>
      </div>
    </div>
  );
}

export default LazyMap;
