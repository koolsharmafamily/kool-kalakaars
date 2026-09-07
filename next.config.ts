import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Stock sources are pre-greyscaled to AVIF/WebP by scripts/prepare-images.mjs.
    // These formats are the negotiated output for any runtime transform.
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    /**
     * CRITICAL CSS — inline the stylesheet into the HTML instead of linking it.
     *
     * The whole stylesheet is ~10 KB, which is small enough to inline whole;
     * there is no need to split "critical" from the rest and manage two
     * copies. What this buys is removing a link in the chain that was
     * measurably delaying the largest paint:
     *
     *   before   document -> stylesheet -> font -> LCP text
     *   after    document (CSS already inside it) -> font -> LCP text
     *
     * That is one fewer round trip before anything can render, which on a
     * simulated slow 4G connection is worth more than the bytes saved.
     *
     * The trade is that the CSS is no longer separately cacheable across
     * navigations. For a single-page site with three tiny stub routes that
     * costs essentially nothing.
     */
    inlineCss: true,
  },
};

export default nextConfig;
