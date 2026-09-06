import type { Metadata } from "next";

/**
 * Stub route. Exists so the footer link is real rather than a 404, but is
 * noindex and kept out of the navigation and the sitemap until it has content.
 */
export const metadata: Metadata = {
  title: "Rules — Kool Kalakaars",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-32 sm:px-8">
      <h1 className="font-display text-d1">Rules</h1>
      <p className="text-lead text-ink-muted mt-6">
        Being written. Until then, anything you need is a message away.
      </p>
      <a
        href="mailto:koolkalakaars@gmail.com"
        className="text-cta mt-6 inline-block font-bold underline underline-offset-4"
      >
        koolkalakaars@gmail.com
      </a>
    </div>
  );
}
