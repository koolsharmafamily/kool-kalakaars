import siteConfig from "@/content/site.config";
import SectionPlaceholder from "@/components/ui/SectionPlaceholder";
import PopImage from "@/components/ui/PopImage";

/**
 * THE SHELL
 * =========
 * Real sections replace these placeholders one at a time, starting with the
 * hero. The section order, the anchor ids and the light/dark rhythm are final.
 *
 * The hero section (id="top") is what the sticky nav and the floating WhatsApp
 * button observe. Both stay hidden until the whole hero is scrolled past.
 */

export default function Home() {
  const { copy, nav } = siteConfig;

  return (
    <>
      {/* ══ 01 · HERO ═══════════════════════════════════════════════════════
          Placeholder. Real hero — video, countdown, two CTAs — is next. */}
      <section
        id="top"
        className="bg-surface relative grid min-h-[100svh] place-items-center overflow-hidden px-5 py-24"
      >
        {/* Animated pop-art gradient stands in for the Runway video. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 10%, var(--color-violet) 0%, transparent 55%)," +
              "radial-gradient(110% 80% at 85% 20%, var(--color-magenta) 0%, transparent 50%)," +
              "radial-gradient(130% 100% at 50% 100%, var(--color-indigo) 20%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="halftone-lg text-cta absolute inset-0 opacity-[0.07]"
        />

        <div className="relative w-full max-w-5xl text-center">
          {/* Logo slot. Sized for a horizontal lockup so nothing moves when
              the real logo arrives. */}
          <div className="border-cta/40 text-cta/70 text-micro mx-auto mb-10 grid h-20 w-80 max-w-full place-items-center rounded-lg border-2 border-dashed font-bold uppercase">
            Logo slot · 320 × 80
          </div>

          <p className="text-eyebrow text-cta font-bold uppercase">
            {copy.hero.eyebrow}
          </p>

          <h1 className="font-display text-hero mt-6">{siteConfig.site.name}</h1>

          <p className="text-lead text-ink-muted mx-auto mt-6 max-w-xl">
            {siteConfig.site.tagline}
          </p>

          <p className="text-eyebrow text-ink mt-10 font-bold uppercase">
            {siteConfig.event.dateTbcLabel}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={copy.hero.primaryCta.href}
              className="bg-cta text-cta-ink hover:bg-brand hover:text-ice inline-flex items-center rounded-full border-2 border-transparent px-8 py-4 text-lg font-extrabold transition-colors"
            >
              {copy.hero.primaryCta.label}
            </a>
            <a
              href={copy.hero.secondaryCta.href}
              className="border-ice text-ink hover:bg-ice hover:text-indigo inline-flex items-center rounded-full border-2 px-8 py-4 text-lg font-extrabold transition-colors"
            >
              {copy.hero.secondaryCta.label}
            </a>
          </div>

          <p className="text-small text-ink-muted mt-5">
            {copy.hero.footnote}
          </p>
        </div>
      </section>

      {/* ══ 02 · THE IDEA ══════════════════════════════════════════════════ */}
      <SectionPlaceholder
        id="idea"
        n="02"
        eyebrow={copy.idea.eyebrow}
        title={copy.idea.heading}
        note={copy.idea.body}
        tone="light"
        minH="min-h-[50vh]"
      />

      {/* ══ 03 · SPONSORS AND PRESS BAND ═══════════════════════════════════
          The compact band that serves audiences one and two early, without
          reordering the page. */}
      <section className="bg-brand text-ice scroll-mt-20 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <div>
            <h2 className="font-display text-d3">{copy.pressBand.heading}</h2>
            <p className="mt-1 max-w-xl">{copy.pressBand.body}</p>
          </div>
          <a
            href={copy.pressBand.cta.href}
            className="bg-ice text-indigo inline-flex shrink-0 items-center rounded-full px-6 py-3 font-extrabold"
          >
            {copy.pressBand.cta.label}
          </a>
        </div>
      </section>

      {/* ══ 04 · WHY NAGPUR ════════════════════════════════════════════════ */}
      <SectionPlaceholder
        id="why"
        n="04"
        eyebrow={copy.whyNagpur.eyebrow}
        title={copy.whyNagpur.heading}
        note="Three observational cards. No invented statistics."
      >
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {copy.whyNagpur.points.map((p) => (
            <li
              key={p.title}
              className="border-rule rounded-xl border p-6"
            >
              <h3 className="font-display text-d3">{p.title}</h3>
              <p className="text-ink-muted mt-3">{p.body}</p>
            </li>
          ))}
        </ul>
      </SectionPlaceholder>

      {/* ══ 05 · THE CATEGORIES ════════════════════════════════════════════
          Also the PopImage proving ground — three treatments side by side. */}
      <SectionPlaceholder
        id="categories"
        n="05"
        eyebrow={copy.categories.eyebrow}
        title={copy.categories.heading}
        note="Pinned horizontal track on desktop, scroll-snap carousel on mobile. The images below show PopImage running with no photography yet."
        tone="violet"
      >
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {copy.categories.items.map((c, i) => (
            <li key={c.name}>
              <PopImage
                src={c.image}
                alt={c.imageAlt}
                width={640}
                height={800}
                duotone={i === 1 ? "violetAcid" : "indigoMagenta"}
                halftone={i === 2 ? "medium" : "soft"}
                shape={i === 1 ? "torn" : "angled"}
                sticker={i === 0 ? "ice" : i === 1 ? "acid" : "magenta"}
                misregister={i === 2 ? 3 : 0}
                rotate={i === 0 ? -1.5 : i === 2 ? 1.5 : 0}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <h3 className="font-display text-d3 mt-6">
                {c.name}{" "}
                <span className="text-cta">[{c.qualifier}]</span>
              </h3>
              <p className="text-ink-muted mt-2">{c.blurb}</p>
            </li>
          ))}
        </ul>
      </SectionPlaceholder>

      {/* ══ 06 · HOW A NIGHT RUNS ══════════════════════════════════════════ */}
      <SectionPlaceholder
        id="format"
        n="06"
        eyebrow={copy.format.eyebrow}
        title={copy.format.heading}
        note="Five numbered steps, scroll-linked reveal."
      >
        <ol className="mt-12 space-y-8">
          {copy.format.steps.map((s, i) => (
            <li key={s.title} className="flex gap-6">
              <span className="font-display text-d2 text-cta leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-d3">{s.title}</h3>
                <p className="text-ink-muted mt-2 max-w-2xl">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </SectionPlaceholder>

      {/* ══ 07 · THE VENUE ═════════════════════════════════════════════════ */}
      <SectionPlaceholder
        id="venue"
        n="07"
        eyebrow={copy.venue.eyebrow}
        title={copy.venue.heading}
        note={siteConfig.venue.note}
        tone="light"
      >
        <div className="border-ink-dark/20 mt-10 aspect-[16/9] w-full max-w-3xl rounded-xl border-2 border-dashed" />
        <p className="text-ink-muted-dark text-small mt-3">
          Map iframe slot · dimensions reserved so it cannot shift the layout
        </p>
      </SectionPlaceholder>

      {/* ══ 08 · BECOME A SPONSOR ══════════════════════════════════════════ */}
      <SectionPlaceholder
        id="sponsor"
        n="08"
        eyebrow={copy.sponsor.eyebrow}
        title={nav.primary.label}
        note={copy.sponsor.lead}
        tone="violet"
      >
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {copy.sponsor.benefits.map((b) => (
            <li key={b.title} className="border-rule rounded-xl border p-6">
              <h3 className="font-display text-d3">{b.title}</h3>
              <p className="text-ink-muted mt-3">{b.body}</p>
            </li>
          ))}
        </ul>
      </SectionPlaceholder>

      {/* ══ 09 · FREE TICKET ═══════════════════════════════════════════════
          data-fab-avoid keeps the floating WhatsApp button off the form. */}
      <SectionPlaceholder
        id="tickets"
        n="09"
        eyebrow={copy.tickets.eyebrow}
        title={copy.tickets.heading}
        note={copy.tickets.lead}
        tone="light"
        data-fab-avoid=""
      >
        <div className="border-ink-dark/20 mt-10 max-w-lg space-y-4 rounded-xl border-2 border-dashed p-6">
          {["Name", "Phone", "Email", "Seats"].map((f) => (
            <div key={f}>
              <span className="text-small text-ink-muted-dark font-bold">
                {f}
              </span>
              <div className="border-ink-dark/25 mt-1 h-12 rounded-lg border" />
            </div>
          ))}
          <p className="text-micro text-ink-muted-dark pt-2">
            Marked data-fab-avoid — the WhatsApp button retreats here.
          </p>
        </div>
      </SectionPlaceholder>

      {/* ══ 10 · APPLY TO PERFORM ══════════════════════════════════════════ */}
      <SectionPlaceholder
        id="perform"
        n="10"
        eyebrow={copy.perform.eyebrow}
        title={copy.perform.heading}
        note={copy.perform.lead}
        data-fab-avoid=""
      >
        <ul className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {copy.perform.fieldPreview.map((f) => (
            <li key={f.label} className="border-rule rounded-lg border p-4">
              <span className="font-bold">{f.label}</span>
              {f.hint ? (
                <span className="text-ink-muted text-small mt-1 block">
                  {f.hint}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </SectionPlaceholder>

      {/* ══ 11 · COMMUNITY ═════════════════════════════════════════════════
          Hidden entirely while the invite link is null — which it is. */}
      {siteConfig.links.whatsappCommunity ? (
        <SectionPlaceholder
          id="community"
          n="11"
          eyebrow={copy.community.eyebrow}
          title={copy.community.heading}
          note={copy.community.body}
          tone="violet"
          minH="min-h-[40vh]"
        />
      ) : null}
    </>
  );
}
