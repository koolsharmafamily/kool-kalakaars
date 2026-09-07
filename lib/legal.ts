import siteConfig from "@/content/site.config";
import type { LegalPage } from "@/content/site.config";

/**
 * LEGAL PAGE PUBLICATION
 * ======================
 * One definition of "published", used by the footer, the sitemap and the
 * pages themselves. A page counts as published when its `body` has at least
 * one non-empty paragraph in it.
 *
 * Keeping this in one place is the point: otherwise the footer link, the
 * sitemap entry and the noindex tag drift apart, and you end up with a page
 * Google has indexed that says "being written".
 */

export type LegalSlug = keyof typeof siteConfig.legal;

export function isPublished(page: LegalPage): boolean {
  return page.body.some((paragraph) => paragraph.trim().length > 0);
}

export function getLegalPage(slug: LegalSlug): LegalPage {
  return siteConfig.legal[slug];
}

/** Every legal page that currently has content, in config order. */
export function publishedLegalPages(): Array<{
  slug: LegalSlug;
  href: string;
  page: LegalPage;
}> {
  return (Object.keys(siteConfig.legal) as LegalSlug[])
    .filter((slug) => isPublished(siteConfig.legal[slug]))
    .map((slug) => ({
      slug,
      href: `/${slug}`,
      page: siteConfig.legal[slug],
    }));
}
