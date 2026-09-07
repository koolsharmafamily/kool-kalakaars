import siteConfig from "@/content/site.config";
import SectionHeading from "@/components/ui/SectionHeading";
import TicketFormClient from "@/components/ui/TicketFormClient";

/**
 * FREE TICKET — SECTION SHELL
 * ===========================
 * A server component. The heading, the lead paragraph and the decoration are
 * plain HTML; only the form itself is interactive, and that lives in
 * <TicketFormClient>.
 *
 * The whole section used to be one "use client" file, which pulled the site
 * config, the section heading and all the surrounding copy into the browser
 * bundle to support four inputs. Splitting at the interactivity boundary keeps
 * everything static on the server where it belongs.
 */

export function TicketForm() {
  const { copy, contact, links, site } = siteConfig;
  const t = copy.tickets;

  return (
    <section
      id="tickets"
      // Keeps the floating WhatsApp button off the form fields.
      data-fab-avoid=""
      className="bg-surface-light text-ink-dark relative scroll-mt-24 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="halftone-lg text-brand pointer-events-none absolute -top-12 -right-20 h-72 w-72 opacity-20"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading eyebrow={t.eyebrow} heading={t.heading} tone="light" />

        <p className="text-lead mt-6 max-w-2xl">{t.lead}</p>

        <div className="mt-12">
          <TicketFormClient
            maxSeats={t.maxSeats}
            labels={{
              submit: t.submitLabel,
              submitting: t.submittingLabel,
              successHeading: t.successHeading,
              successBody: t.successBody,
              errorHeading: t.errorHeading,
              errorBody: t.errorBody,
              consent: t.consent,
            }}
            contact={{
              phoneDisplay: contact.phoneDisplay,
              email: contact.email,
              whatsappChat: links.whatsappChat,
            }}
            siteName={site.name}
          />
        </div>
      </div>
    </section>
  );
}

export default TicketForm;
