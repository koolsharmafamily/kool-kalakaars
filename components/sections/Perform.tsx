import siteConfig from "@/content/site.config";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * APPLY TO PERFORM
 * ================
 * Previews the Google Form question by question, then hands over to Google.
 *
 * ── WHY THE FORM IS NOT EMBEDDED ────────────────────────────────────────────
 * It accepts a file upload, which requires a Google sign-in on Google's own
 * domain. An iframed Google Form inside a pop-art page looks broken, and the
 * upload control misbehaves in an iframe on mobile. So we do the one thing an
 * embed cannot: tell people exactly what is coming, so they gather their link
 * and their song choice before they start rather than abandoning it halfway.
 *
 * This list mirrors the live form question for question. If the form changes,
 * `copy.perform.fieldPreview` has to change with it — a preview that lies is
 * worse than no preview.
 *
 * ── THE MONEY ───────────────────────────────────────────────────────────────
 * Applying is free. The nominal fee applies only on selection. That is stated
 * twice, in the lead and again beside the button, because it is the single
 * thing most likely to stop somebody applying.
 */

export function Perform() {
  const { copy, links, contact, site } = siteConfig;
  const p = copy.perform;
  const formReady = Boolean(links.performerForm);

  return (
    <section
      id="perform"
      data-fab-avoid=""
      className="bg-surface relative scroll-mt-24 overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading eyebrow={p.eyebrow} heading={p.heading} />

        <p className="text-lead text-ink-muted mt-6 max-w-2xl">{p.lead}</p>

        {/* ── FREE TO APPLY, SAID PLAINLY ──────────────────────────────── */}
        <p className="border-cta text-ink mt-8 inline-flex max-w-2xl border-l-4 py-2 pl-4 font-bold">
          Applying costs nothing. The nominal fee is payable only if you are
          selected.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* ── WHAT THE FORM ASKS ─────────────────────────────────────── */}
          <div>
            <h3 className="text-eyebrow text-cta font-bold uppercase">
              What the form asks for
            </h3>

            <ol className="mt-6 space-y-px">
              {p.fieldPreview.map((field, i) => (
                <li
                  key={field.label}
                  className="border-rule flex gap-4 border-b py-4 last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-cta w-7 shrink-0 text-lg leading-tight"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold">
                      {field.label}
                      {field.optional ? (
                        <span className="text-ink-muted ml-2 text-sm font-normal">
                          optional
                        </span>
                      ) : null}
                    </p>
                    {field.hint ? (
                      <p className="text-ink-muted text-small mt-1">
                        {field.hint}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ── THE HANDOVER ───────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="border-rule bg-surface-2 border p-7">
              <h3 className="font-display text-d3 uppercase">Ready?</h3>
              <p className="text-ink-muted mt-3">{p.note}</p>

              {formReady ? (
                <>
                  <a
                    href={links.performerForm as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-cta text-cta-ink hover:bg-brand hover:text-ice mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-lg font-extrabold transition-colors"
                  >
                    {p.ctaLabel}
                    {/* Marks that this leaves the site. The link text already
                        says "opens on Google" for screen readers below. */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </a>
                  <p className="text-small text-ink-muted mt-3 text-center">
                    Opens on Google in a new tab.
                  </p>
                </>
              ) : (
                /* No form URL configured — a WhatsApp route rather than a
                   dead button. */
                <>
                  <a
                    href={`${links.whatsappChat}?text=${encodeURIComponent(
                      `Hello — I would like to apply to perform at ${site.name}.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-cta text-cta-ink mt-7 inline-flex w-full items-center justify-center rounded-full px-8 py-4 text-lg font-extrabold"
                  >
                    {p.ctaPendingLabel}
                  </a>
                  <p className="text-small text-ink-muted mt-3 text-center">
                    {contact.phoneDisplay}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Perform;
