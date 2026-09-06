import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Stock sources are pre-greyscaled to AVIF/WebP by scripts/prepare-images.mjs.
    // These formats are the negotiated output for any runtime transform.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
