import Link from "next/link";

/**
 * The real single-page site is built in the next steps: hero, then the
 * content sections, then forms, then the animation layer.
 * This placeholder exists only so the dev server has a root route.
 */
export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center p-8 text-center">
      <div className="max-w-md">
        <p className="text-eyebrow text-ink-muted font-body font-bold uppercase">
          Scaffold complete
        </p>
        <h1 className="font-display text-d2 mt-4">Kool Kalakaars</h1>
        <p className="text-ink-muted mt-4">
          The homepage is built next. Tokens, typography and components are
          ready to review.
        </p>
        <Link
          href="/styleguide"
          className="bg-cta text-cta-ink mt-8 inline-flex rounded-full border-2 px-6 py-3 font-bold"
        >
          Open the style guide
        </Link>
      </div>
    </main>
  );
}
