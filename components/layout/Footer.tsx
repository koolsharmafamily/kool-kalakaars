import Link from "next/link";
import siteConfig from "@/content/site.config";
import SocialLinks from "@/components/ui/SocialLinks";
import { publishedLegalPages } from "@/lib/legal";

/**
 * FOOTER
 * ======
 * Contact, venue, socials slot, credits and the legal routes.
 *
 * The social row renders nothing at all while `socials` is empty — no
 * placeholder icons and no dead links. The legal links point at real routes
 * that exist but are kept out of the navigation until they have content.
 */

export function Footer() {
  const { site, contact, venue, copy } = siteConfig;

  // Only legal pages that actually have content. All three are empty today,
  // so no legal row renders at all — better than linking to three pages that
  // each say "being written".
  const legal = publishedLegalPages();

  return (
    <footer className="border-rule bg-surface border-t">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* ── IDENTITY ────────────────────────────────────────────────── */}
          <div>
            <p className="font-display text-d3 leading-none">{site.name}</p>
            <p className="text-ink-muted mt-4 max-w-xs">{site.tagline}</p>
            <SocialLinks className="mt-6" />
          </div>

          {/* ── CONTACT ─────────────────────────────────────────────────── */}
          <div>
            <h2 className="text-eyebrow text-cta font-bold uppercase">
              Contact
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`tel:+${contact.phoneE164}`}
                  className="text-ink hover:text-cta font-bold transition-colors"
                >
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-ink hover:text-cta font-bold break-all transition-colors"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.whatsappChat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-muted hover:text-cta text-small transition-colors"
                >
                  Message us on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* ── VENUE ───────────────────────────────────────────────────── */}
          <div>
            <h2 className="text-eyebrow text-cta font-bold uppercase">Venue</h2>
            <address className="text-ink-muted mt-5 not-italic">
              <span className="text-ink block font-bold">{venue.name}</span>
              {venue.street}
              <br />
              {venue.city}, {venue.region}
            </address>
            <a
              href={venue.mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-small hover:text-cta mt-3 inline-block font-bold underline underline-offset-4 transition-colors"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* ── BASELINE ──────────────────────────────────────────────────── */}
        <div className="border-rule mt-14 flex flex-col gap-5 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-micro text-ink-muted">{copy.footer.credit}</p>

          {legal.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legal.map((entry) => (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    className="text-micro text-ink-muted hover:text-ink font-bold uppercase transition-colors"
                  >
                    {entry.page.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
