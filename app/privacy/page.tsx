import type { Metadata } from "next";
import Link from "next/link";
import siteConfig from "@/content/site.config";
import { isPublished } from "@/lib/legal";

/**
 * Driven entirely by `legal.privacy` in site.config.ts.
 *
 * While its `body` is empty the page is unpublished: noindex, absent from the
 * footer and absent from the sitemap, showing a short note instead of a 404 so
 * that an existing link never breaks. Add paragraphs to the config and it
 * publishes itself.
 */

const page = siteConfig.legal.privacy;
const published = isPublished(page);

export const metadata: Metadata = {
  title: `${page.title} — ${siteConfig.site.name}`,
  // Unpublished pages must not reach search results.
  robots: published ? undefined : { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-28 sm:px-8 sm:py-36">
      <h1 className="font-display text-d1 uppercase">{page.title}</h1>

      {published ? (
        <div className="mt-10 space-y-5">
          {page.body.map((paragraph, i) => (
            <p key={i} className="text-lead text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <>
          <p className="text-lead text-ink-muted mt-8">
            Still being written. Until it is here, anything you need to know is
            a message away.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="bg-cta text-cta-ink inline-flex items-center rounded-full px-6 py-3 font-extrabold"
            >
              {siteConfig.contact.email}
            </a>
            <Link
              href="/"
              className="border-ice text-ink inline-flex items-center rounded-full border-2 px-6 py-3 font-extrabold"
            >
              Back to the site
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
