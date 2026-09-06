import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";

/**
 * STYLE GUIDE — development only.
 *
 * Returns a 404 in production, is excluded from the sitemap, and is never
 * linked from the site navigation. It exists so the palette, type scale and
 * component states can be reviewed in one place.
 *
 * Every contrast ratio printed on this page was computed with the WCAG 2.1
 * relative-luminance formula against the stated background, not estimated.
 */

export const metadata: Metadata = {
  title: "Style guide — Kool Kalakaars",
  robots: { index: false, follow: false },
};

/* ─── DATA ──────────────────────────────────────────────────────────────── */

type Swatch = {
  token: string;
  hex: string;
  role: string;
  onIndigo: string;
  onIce: string;
  verdict: "AAA" | "AA" | "LARGE" | "FAIL" | "—";
};

const CORE: Swatch[] = [
  { token: "indigo", hex: "#392989", role: "Deep base. Dominant background.", onIndigo: "—", onIce: "10.48", verdict: "AAA" },
  { token: "violet", hex: "#5F278B", role: "Secondary surfaces, gradients.", onIndigo: "1.16", onIce: "9.03", verdict: "AAA" },
  { token: "lilac", hex: "#985DC7", role: "Decorative only. See the note below.", onIndigo: "2.55", onIce: "4.11", verdict: "FAIL" },
  { token: "magenta", hex: "#B431A1", role: "Brand signature. Fill on dark, text on light.", onIndigo: "2.10", onIce: "4.98", verdict: "AA" },
  { token: "ice", hex: "#E9F9FB", role: "Primary text on dark; light-section ground.", onIndigo: "10.48", onIce: "—", verdict: "AAA" },
];

const ACCENTS: Swatch[] = [
  { token: "acid", hex: "#F5E13C", role: "CTA fills, halftone pops, focus ring.", onIndigo: "8.49", onIce: "1.23", verdict: "AAA" },
  { token: "flame", hex: "#FF5E3A", role: "Display-scale highlights only.", onIndigo: "3.73", onIce: "2.81", verdict: "LARGE" },
];

const SEMANTIC = [
  { token: "surface", maps: "indigo", note: "Page and section background." },
  { token: "surface-2", maps: "violet", note: "Secondary panels and gradient stops." },
  { token: "surface-light", maps: "ice", note: "The light sections." },
  { token: "brand", maps: "magenta", note: "Brand signature fills." },
  { token: "ink", maps: "ice", note: "Body text on dark. 10.48:1" },
  { token: "ink-dark", maps: "indigo", note: "Body text on light. 10.48:1" },
  { token: "ink-muted", maps: "ice mixed to 72%", note: "Muted text on dark. 6.20:1" },
  { token: "ink-muted-dark", maps: "indigo mixed to 78%", note: "Muted text on light. 5.75:1" },
  { token: "cta", maps: "acid", note: "Primary button fill. REBINDABLE." },
  { token: "cta-ink", maps: "indigo", note: "Text on the primary button. REBINDABLE." },
  { token: "focus", maps: "acid", note: "Focus ring. 8.49:1. REBINDABLE." },
  { token: "highlight", maps: "flame", note: "Display-scale accents. REBINDABLE." },
];

const TYPE = [
  { token: "text-hero", spec: "clamp(3.25rem → 13vw → 9rem) / 0.86", face: "display", sample: "Kool Kalakaars" },
  { token: "text-d1", spec: "clamp(2.75rem → 9vw → 6rem) / 0.90", face: "display", sample: "Three ways up" },
  { token: "text-d2", spec: "clamp(2rem → 6.5vw → 4rem) / 0.94", face: "display", sample: "Become a sponsor" },
  { token: "text-d3", spec: "clamp(1.5rem → 4.5vw → 2.5rem) / 1.0", face: "display", sample: "How a night runs" },
  { token: "text-lead", spec: "clamp(1.125rem → 2.5vw → 1.5rem) / 1.45", face: "body", sample: "Entry is free. This is only so we know how many chairs to put out." },
  { token: "text-body", spec: "1rem / 1.6", face: "body", sample: "A recurring live music competition and open mic in Nagpur, hosted at Chitnavis Centre." },
  { token: "text-small", spec: "0.875rem / 1.5", face: "body", sample: "Applying is free. The nominal fee is payable only if you are selected." },
  { token: "text-micro", spec: "0.75rem / 1.4 / 0.06em", face: "body", sample: "Kool Kalakaars is an independent, not-for-profit initiative." },
];

/* ─── LAYOUT HELPERS ────────────────────────────────────────────────────── */

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-rule border-t py-14">
      <div className="mb-8 flex items-baseline gap-4">
        <span className="text-cta font-display text-d3 leading-none">{n}</span>
        <h2 className="font-display text-d3 leading-none">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Verdict({ v }: { v: Swatch["verdict"] }) {
  const styles: Record<Swatch["verdict"], string> = {
    AAA: "bg-cta text-cta-ink",
    AA: "bg-ice text-indigo",
    LARGE: "bg-transparent text-ink border border-rule",
    FAIL: "bg-magenta text-ice",
    "—": "bg-transparent text-ink-muted",
  };
  const labels: Record<Swatch["verdict"], string> = {
    AAA: "AAA", AA: "AA", LARGE: "LARGE ONLY", FAIL: "TEXT: FAIL", "—": "—",
  };
  return (
    <span className={`text-micro inline-block rounded-full px-2.5 py-1 font-bold tracking-wide ${styles[v]}`}>
      {labels[v]}
    </span>
  );
}

function SwatchRow({ s }: { s: Swatch }) {
  return (
    <li className="border-rule flex flex-wrap items-center gap-x-5 gap-y-3 border-b py-4 last:border-b-0">
      <span
        className="border-rule size-16 shrink-0 rounded-lg border"
        style={{ background: `var(--color-${s.token})` }}
        aria-hidden="true"
      />
      <span className="min-w-[8rem]">
        <span className="block font-bold">{s.token}</span>
        <code className="text-ink-muted text-small tabular-nums">{s.hex}</code>
      </span>
      <span className="text-ink-muted text-small min-w-[14rem] flex-1">{s.role}</span>
      <span className="text-small tabular-nums">
        <span className="text-ink-muted">on indigo </span>
        <span className="font-bold">{s.onIndigo}</span>
      </span>
      <span className="text-small tabular-nums">
        <span className="text-ink-muted">on ice </span>
        <span className="font-bold">{s.onIce}</span>
      </span>
      <Verdict v={s.verdict} />
    </li>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────────────────── */

export default function StyleGuide() {
  // Dev only. In a production build this route 404s.
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      {/* Masthead */}
      <header>
        <p className="text-eyebrow text-cta font-bold uppercase">
          Internal · not indexed · dev only
        </p>
        <h1 className="font-display text-d1 misregister mt-5">Style guide</h1>
        <p className="text-lead text-ink-muted mt-5 max-w-2xl">
          Every colour, every type size and every button state in the system.
          Contrast ratios are computed, not estimated.
        </p>
      </header>

      {/* ── 01 CORE PALETTE ─────────────────────────────────────────────── */}
      <Section n="01" title="Core palette">
        <ul>
          {CORE.map((s) => <SwatchRow key={s.token} s={s} />)}
        </ul>

        <div className="border-magenta bg-magenta/15 mt-8 rounded-xl border-2 p-5">
          <p className="font-bold">Two roles from the brief had to change.</p>
          <p className="text-ink-muted mt-2 max-w-3xl">
            <strong className="text-ink">lilac</strong> was specified as
            &ldquo;muted text on dark&rdquo;. At 2.55:1 on indigo it fails every
            WCAG threshold, including the 3:1 minimum for non-text UI, so it
            cannot carry text, a border or a focus ring. It is now decorative
            only. <strong className="text-ink">magenta</strong> at 2.10:1 on
            indigo cannot be text on dark either — it lives as a fill on dark
            and as text on the light sections, where it measures 4.98:1 and
            passes AA.
          </p>
        </div>
      </Section>

      {/* ── 02 REMOVABLE ACCENTS ────────────────────────────────────────── */}
      <Section n="02" title="Removable accents">
        <p className="text-ink-muted mb-6 max-w-3xl">
          The two colours added to the original five. They are declared in one
          block in <code className="text-ink">app/globals.css</code> and reach
          components only through four semantic aliases, so removing them means
          repointing four lines and nothing else.
        </p>
        <ul>
          {ACCENTS.map((s) => <SwatchRow key={s.token} s={s} />)}
        </ul>

        <div className="border-rule mt-8 rounded-xl border p-5">
          <p className="text-small text-ink-muted mb-3 font-bold uppercase tracking-wide">
            To remove acid and flame, change these four lines
          </p>
          <pre className="text-small overflow-x-auto leading-relaxed">
            <code>{`--color-cta:       var(--color-magenta);
--color-cta-ink:   var(--color-ice);
--color-focus:     var(--color-ice);
--color-highlight: var(--color-magenta);`}</code>
          </pre>
        </div>
      </Section>

      {/* ── 03 SEMANTIC TOKENS ──────────────────────────────────────────── */}
      <Section n="03" title="Semantic tokens">
        <p className="text-ink-muted mb-6 max-w-3xl">
          What components actually reference. No component names a raw colour,
          which is what makes the accents removable in one place.
        </p>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {SEMANTIC.map((t) => (
            <li key={t.token} className="border-rule flex items-center gap-4 border-b py-3">
              <span
                className="border-rule size-9 shrink-0 rounded border"
                style={{ background: `var(--color-${t.token})` }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <code className="block font-bold">--color-{t.token}</code>
                <span className="text-ink-muted text-small">
                  {t.maps} · {t.note}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── 04 TYPE SCALE ───────────────────────────────────────────────── */}
      <Section n="04" title="Type scale">
        <p className="text-ink-muted mb-8 max-w-3xl">
          Resize the window to watch the clamps move. Every display size carries
          a pinned line-height, so a font swap changes glyph shapes but never
          box height — zero layout shift.
        </p>
        <div className="space-y-10">
          {TYPE.map((t) => (
            <div key={t.token}>
              <div className="text-micro text-ink-muted mb-3 flex flex-wrap gap-x-4 font-bold uppercase">
                <code className="text-cta">{t.token}</code>
                <span>{t.spec}</span>
                <span>{t.face === "display" ? "Anton" : "Manrope"}</span>
              </div>
              <p
                className={
                  t.face === "display"
                    ? `font-display ${t.token} uppercase`
                    : `font-body ${t.token}`
                }
              >
                {t.sample}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 05 FONT STACK ───────────────────────────────────────────────── */}
      <Section n="05" title="Latin and Devanagari in one stack">
        <p className="text-ink-muted mb-8 max-w-3xl">
          There is no class on the Hindi words below and no markup around them.
          The stack is <code className="text-ink">Manrope → Noto Sans Devanagari</code>,
          and the browser falls through per glyph. The x-height and weight are
          matched closely enough that the join is invisible at reading size.
        </p>

        <div className="border-rule space-y-8 rounded-xl border p-6 sm:p-8">
          <div>
            <p className="text-micro text-ink-muted mb-3 font-bold uppercase">
              Mid-sentence script change · body
            </p>
            <p className="text-lead">
              चलो — bring the whole band. सुनो first, then decide whether the
              room is ready for you.
            </p>
          </div>

          <div>
            <p className="text-micro text-ink-muted mb-3 font-bold uppercase">
              Display face · Anton falls through to Noto for Devanagari
            </p>
            <p className="font-display text-d2">तीन रास्ते · Three ways up</p>
          </div>

          <div>
            <p className="text-micro text-ink-muted mb-3 font-bold uppercase">
              Eyebrow usage · the intended pattern
            </p>
            <p className="text-eyebrow text-cta font-bold uppercase">सुनो</p>
            <p className="font-display text-d3 mt-2">The idea</p>
          </div>
        </div>

        <p className="text-small text-ink-muted mt-5 max-w-3xl">
          Hindi is flavour only. Nothing a visitor must understand — no
          navigation label, form label, error message, price or date — is ever
          in Devanagari.
        </p>
      </Section>

      {/* ── 06 BUTTONS ──────────────────────────────────────────────────── */}
      <Section n="06" title="Buttons">
        <div className="space-y-10">
          <div>
            <p className="text-micro text-ink-muted mb-4 font-bold uppercase">
              Variants · rest state · hover and focus them to check
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Get free ticket</Button>
              <Button variant="secondary">Apply to perform</Button>
              <Button variant="ghost">Read the rules</Button>
            </div>
          </div>

          <div>
            <p className="text-micro text-ink-muted mb-4 font-bold uppercase">
              Sizes
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div>
            <p className="text-micro text-ink-muted mb-4 font-bold uppercase">
              States
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button>Default</Button>
              <Button loading>Sending</Button>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" loading>
                Sending
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          <div>
            <p className="text-micro text-ink-muted mb-4 font-bold uppercase">
              Hinglish label with an English accessible name
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button label="Register">Chalo, register karo</Button>
            </div>
            <p className="text-small text-ink-muted mt-3">
              A screen reader announces &ldquo;Register, link&rdquo;. The visible
              text stays playful; the spoken name stays functional.
            </p>
          </div>

          <div className="bg-surface-light rounded-xl p-6 sm:p-8">
            <p className="text-micro text-ink-muted-dark mb-4 font-bold uppercase">
              On the light sections
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="onLight">Become a sponsor</Button>
              <Button variant="onLight" disabled>
                Disabled
              </Button>
            </div>
          </div>

          <div>
            <p className="text-micro text-ink-muted mb-4 font-bold uppercase">
              Keyboard focus · tab through the row
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">One</Button>
              <Button variant="secondary">Two</Button>
              <Button variant="ghost">Three</Button>
            </div>
            <p className="text-small text-ink-muted mt-3">
              A 3px acid ring at 8.49:1 on indigo, offset 3px. The highest
              contrast the palette can produce.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 07 TEXTURES ─────────────────────────────────────────────────── */}
      <Section n="07" title="Pop-art textures">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-micro text-ink-muted mb-3 font-bold uppercase">
              .halftone · 8px
            </p>
            <div className="halftone text-lilac border-rule h-32 rounded-xl border" />
          </div>
          <div>
            <p className="text-micro text-ink-muted mb-3 font-bold uppercase">
              .halftone-lg · 16px, acid
            </p>
            <div className="halftone-lg text-cta border-rule h-32 rounded-xl border" />
          </div>
          <div>
            <p className="text-micro text-ink-muted mb-3 font-bold uppercase">
              .misregister
            </p>
            <div className="border-rule grid h-32 place-items-center rounded-xl border">
              <span className="font-display text-d3 misregister">Nagpur</span>
            </div>
          </div>
        </div>
        <p className="text-small text-ink-muted mt-5 max-w-3xl">
          Halftone is a tiled radial-gradient in CSS, not an image — no network
          cost and it tiles to any size. Misregistration is a static text-shadow.
          Neither is ever animated.
        </p>
      </Section>

      <footer className="border-rule text-small text-ink-muted border-t py-10">
        Development route. Returns 404 in production, excluded from the sitemap,
        never linked from the site.
      </footer>
    </main>
  );
}
