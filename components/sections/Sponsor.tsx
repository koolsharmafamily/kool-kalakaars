import siteConfig from "@/content/site.config";
import SponsorLogos from "@/components/flagged/SponsorLogos";

/**
 * BECOME A SPONSOR
 * ================
 * The most important section on the site. Sponsors are the primary audience,
 * and this is the one block that has to stop a scroll.
 *
 * ── HOW IT GETS THE CONTRAST WITHOUT BREAKING THE PALETTE ───────────────────
 * The obvious move is a full acid ground, and the palette rules forbid it —
 * acid and flame must never occupy large fills. So the loudness comes from
 * structure instead:
 *
 *   · torn paper edges top and bottom, so the whole block reads as something
 *     pasted over the page rather than another section of it
 *   · a saturated violet-to-magenta wash on the indigo base, the most
 *     colour-forward ground on the site
 *   · the three benefits as ICE cut-paper cards — a large light fill on a
 *     dark ground, which is the highest-contrast move available (10.48:1)
 *     and is exactly what makes it impossible to scroll past
 *   · acid reserved for the display word and the primary button
 *
 * The section directly above this one is the venue on an ice ground, so the
 * saturated dark here is a hard cut rather than a continuation.
 *
 * ── CONTRAST ────────────────────────────────────────────────────────────────
 *   ice text on the indigo/violet ground   10.48:1  AAA
 *   indigo text on the ice cards           10.48:1  AAA
 *   magenta card labels on ice              4.98:1  AA
 *   indigo on the acid button               8.49:1  AAA
 */

/** Torn edges. Two different polygons so top and bottom are not mirror images. */
const TORN_TOP =
  "polygon(0 22%, 4% 8%, 11% 20%, 19% 4%, 27% 17%, 35% 3%, 44% 15%, 52% 2%, 61% 14%, 69% 1%, 78% 13%, 86% 2%, 93% 15%, 100% 6%, 100% 100%, 0 100%)";
const TORN_BOTTOM =
  "polygon(0 0, 100% 0, 100% 94%, 94% 99%, 86% 86%, 77% 98%, 68% 85%, 59% 97%, 50% 84%, 41% 96%, 32% 83%, 23% 97%, 14% 85%, 6% 98%, 0 88%)";

const CARD_SHAPE =
  "polygon(0% 3%, 3% 0%, 97% 1.5%, 100% 5%, 99% 96%, 96% 100%, 2.5% 98.5%, 0% 95%)";

export function Sponsor() {
  const { copy, links, contact, site } = siteConfig;
  const s = copy.sponsor;

  const deckReady = Boolean(links.sponsorDeck);

  // With no deck, the button becomes an email that asks for it — never a dead
  // link, and never a disabled control that gives the visitor nowhere to go.
  const deckHref = deckReady
    ? (links.sponsorDeck as string)
    : `mailto:${contact.email}?subject=${encodeURIComponent(
        `Sponsor deck request — ${site.name}`,
      )}`;

  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(
    s.emailSubject,
  )}`;

  const waHref = `${links.whatsappChat}?text=${encodeURIComponent(
    `Hello — I would like to talk about sponsoring ${site.name}.`,
  )}`;

  return (
    <section id="sponsor" className="relative scroll-mt-24">
      {/* ── TORN TOP EDGE ─────────────────────────────────────────────────
          Sits above the block and is cut from the same ground, so the section
          looks torn from the page rather than bordered. */}
      <div
        aria-hidden="true"
        className="bg-surface-2 relative -mb-px h-10 w-full sm:h-16"
        style={{ clipPath: TORN_TOP }}
      />

      <div className="bg-surface-2 relative overflow-hidden">
        {/* Saturated wash — the most colour-forward ground on the site. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 12% 0%, var(--color-magenta) 0%, transparent 60%)," +
              "radial-gradient(80% 80% at 95% 100%, var(--color-indigo) 0%, transparent 65%)",
          }}
        />
        <div
          aria-hidden="true"
          className="halftone-lg text-cta pointer-events-none absolute inset-0 opacity-[0.12]"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          {/* ── THE ASK ─────────────────────────────────────────────────── */}
          <p className="text-eyebrow text-cta font-bold">
            <span lang="hi">{s.eyebrow}</span>
          </p>

          <h2 className="font-display text-d1 mt-4 max-w-4xl uppercase">
            Become a <span className="text-cta">sponsor</span>
          </h2>

          <p className="text-lead mt-6 max-w-2xl">{s.lead}</p>

          {/* ── WHAT A SPONSOR GETS ─────────────────────────────────────────
              Ice cards on a dark ground. The single highest-contrast move in
              the palette, and the reason this block stops a scroll. */}
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {s.benefits.map((benefit, i) => (
              <li key={benefit.title} className="relative">
                {/* Misregistered plate, static. */}
                <div
                  aria-hidden="true"
                  className="bg-cta absolute inset-0 translate-x-1.5 translate-y-1.5 opacity-80"
                  style={{ clipPath: CARD_SHAPE }}
                />

                <div
                  className="bg-surface-light text-ink-dark relative flex h-full flex-col p-7"
                  style={{ clipPath: CARD_SHAPE }}
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-brand text-4xl leading-none"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-d3 mt-4 uppercase">
                    {benefit.title}
                  </h3>
                  <p className="text-ink-muted-dark mt-3">{benefit.body}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* ── THE ACTIONS ─────────────────────────────────────────────────
              Deck first, then two direct routes to a human. Three ways to act
              and none of them is a dead end. */}
          <div className="mt-14">
            <div className="flex flex-col gap-3 min-[560px]:flex-row min-[560px]:flex-wrap">
              <a
                href={deckHref}
                {...(deckReady
                  ? { download: "", target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="bg-cta text-cta-ink hover:bg-ice inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-lg font-extrabold transition-colors"
              >
                {deckReady ? s.deckReadyLabel : s.deckPendingLabel}
              </a>

              <a
                href={mailHref}
                className="border-ice text-ink hover:bg-ice hover:text-indigo inline-flex items-center justify-center rounded-full border-2 px-8 py-4 text-lg font-extrabold transition-colors"
              >
                {s.contactCta}
              </a>
            </div>

            {/* Graceful state: says plainly that the deck does not exist yet
                and what happens instead. */}
            {!deckReady ? (
              <p className="text-small text-ink mt-4 max-w-md">
                {s.deckPendingNote}
              </p>
            ) : null}
          </div>

          {/* ── DIRECT CONTACT, WRITTEN OUT ─────────────────────────────────
              Buttons are convenient; a sponsor forwarding this to a colleague
              needs the actual address and number as selectable text. */}
          <div className="border-rule mt-12 flex flex-col gap-x-10 gap-y-4 border-t pt-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-micro text-ink font-bold uppercase opacity-80">
                Email
              </p>
              <a
                href={mailHref}
                className="hover:text-cta text-lg font-bold break-all transition-colors"
              >
                {contact.email}
              </a>
            </div>

            <div>
              <p className="text-micro text-ink font-bold uppercase opacity-80">
                WhatsApp
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cta text-lg font-bold transition-colors"
              >
                {contact.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Built and wired. Renders nothing until there are real, signed
              sponsors and the flag is switched on. */}
          <SponsorLogos className="mt-16" />
        </div>
      </div>

      {/* ── TORN BOTTOM EDGE ──────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="bg-surface-2 relative -mt-px h-10 w-full sm:h-16"
        style={{ clipPath: TORN_BOTTOM }}
      />
    </section>
  );
}

export default Sponsor;
