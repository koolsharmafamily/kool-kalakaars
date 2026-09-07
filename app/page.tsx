import siteConfig from "@/content/site.config";
import Hero from "@/components/sections/Hero";
import Idea from "@/components/sections/Idea";
import WhyNagpur from "@/components/sections/WhyNagpur";
import Categories from "@/components/sections/Categories";
import HowANightRuns from "@/components/sections/HowANightRuns";
import Venue from "@/components/sections/Venue";
import Sponsor from "@/components/sections/Sponsor";
import TicketForm from "@/components/sections/TicketForm";
import Perform from "@/components/sections/Perform";
import Community from "@/components/sections/Community";

/**
 * THE PAGE
 * ========
 * Every section is now built. What remains is the animation layer, the
 * Runway video swap, and the metadata / structured-data pass.
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
 *   07 Sponsor       violet     <- torn edges, ice cards, the hard stop
 *   08 Tickets       ice        <- the native form
 *   09 Perform       indigo     <- previews the Google Form, links out
 *   10 Community     violet
 *
 * The hero (id="top") is what the sticky nav and the floating WhatsApp button
 * observe. Both stay hidden until the whole hero is scrolled past.
 */

export default function Home() {
  const { copy } = siteConfig;

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

      <Sponsor />

      <TicketForm />

      <Perform />

      <Community />
    </>
  );
}
