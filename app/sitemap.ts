import type { MetadataRoute } from "next";
import siteConfig from "@/content/site.config";
import { publishedLegalPages } from "@/lib/legal";

/**
 * SITEMAP
 * =======
 * The homepage, plus any legal page that actually has content.
 *
 * Unpublished legal pages are left out entirely, and /styleguide is never
 * listed — it 404s in production anyway. Listing a page that says "being
 * written" invites Google to index it and then show it in results.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.site.url;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...publishedLegalPages().map((entry) => ({
      url: `${base}${entry.href}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
