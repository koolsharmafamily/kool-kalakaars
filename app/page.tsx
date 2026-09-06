import siteConfig from "@/content/site.config";
import SectionPlaceholder from "@/components/ui/SectionPlaceholder";
import Hero from "@/components/sections/Hero";
import Idea from "@/components/sections/Idea";
import WhyNagpur from "@/components/sections/WhyNagpur";
import Categories from "@/components/sections/Categories";
import HowANightRuns from "@/components/sections/HowANightRuns";
import Venue from "@/components/sections/Venue";

/**
 * THE PAGE
 * ========
 * Sections 1 to 6 are built. 7 to 9 are still placeholders and get replaced
 * next, in order: sponsor, free ticket form, apply to perform.
 *
 * The light/dark rhythm is deliberate and worth preserving as the remaining
 * sections land:
 *
 *   01 Hero          indigo
 *   02 The idea      ice        <- the quiet one, for the press
 *   -- Press band    magenta
 *   03 Why Nagpur    indigo
 *   04 Categories    violet     <- the loud one, all the photography
 *   05 The night     indigo
 *   06 Venue         ice        <- light, so the bright map belongs
 *   07 Sponsor       violet     (placeholder)
 *   08 Tickets       ice        (placeholder)
 *   09 Perform       indigo     (placeholder)
 *
 * The hero (id="top") is what the sticky nav and the floating WhatsApp button
 * observe. Both stay hidden until the whole hero is scrolled past.
 */

export default function Home() {
  const { copy, nav } = siteConfig;

  return (
    <>
      <Hero />

      <Idea />

      {/* ══ SPONSORS AND PRESS BAND ════════════════════════════════════════
          Serves the two highest-priority audiences early, without reordering
          the page around them. */}
      <section className="bg-brand text-ice scroll-mt-24 px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-d3 uppercase">
              {copy.pressBand.heading}
            </h2>
            <p className="mt-2 max-w-xl">{copy.pressBand.body}</p>
          </div>
          <a
            href={copy.pressBand.cta.href}
            className="bg-ice text-indigo hover:bg-cta inline-flex shrink-0 items-center rounded-full px-6 py-3 font-extrabold transition-colors"
          >
            {copy.pressBand.cta.label}
          </a>
        </div>
      </section>

      <WhyNagpur />

      <Categories />

      <HowANightRuns />

      <Venue />

      {/* ══ 07 · BECOME A SPONSOR ══════════════════════════════════════════ */}
      <SectionPlaceholder
        id="sponsor"
        n="07"
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

      {/* ══ 08 · FREE TICKET ═══════════════════════════════════════════════
          data-fab-avoid keeps the floating WhatsApp button off the form. */}
      <SectionPlaceholder
        id="tickets"
        n="08"
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
        </div>
      </SectionPlaceholder>

      {/* ══ 09 · APPLY TO PERFORM ══════════════════════════════════════════ */}
      <SectionPlaceholder
        id="perform"
        n="09"
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

      {/* ══ 10 · COMMUNITY ═════════════════════════════════════════════════
          Hidden entirely while the invite link is null — which it is. */}
      {siteConfig.links.whatsappCommunity ? (
        <SectionPlaceholder
          id="community"
          n="10"
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
