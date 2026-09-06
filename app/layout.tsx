import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import siteConfig from "@/content/site.config";
import "./globals.css";

/**
 * Full metadata — Open Graph, Twitter cards, canonical URL and structured
 * data — lands in build step 7. This is the shell it will hang from.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site.url),
  title: siteConfig.site.metaTitle,
  description: siteConfig.site.metaDescription,
};

export const viewport: Viewport = {
  themeColor: "#392989",
  // Never block pinch-zoom. Capping user-scalable is an accessibility failure.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-surface text-ink font-body antialiased">
        {children}
      </body>
    </html>
  );
}
