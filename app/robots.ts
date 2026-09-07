import type { MetadataRoute } from "next";
import siteConfig from "@/content/site.config";

/**
 * ROBOTS
 * ======
 * /styleguide and /api are disallowed explicitly. The styleguide 404s in
 * production regardless, but saying so costs nothing and stops crawlers
 * wasting requests on it.
 *
 * Unpublished legal pages are not listed here — they carry their own noindex
 * tag, which is the stronger signal and the one that keeps working if this
 * file is ever missed.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.site.url;

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/styleguide", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
