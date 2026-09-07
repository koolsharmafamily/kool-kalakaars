import siteConfig from "@/content/site.config";

/**
 * JOIN THE COMMUNITY
 * ==================
 * ── WHY THIS DOES NOT HIDE ITSELF ───────────────────────────────────────────
 * The original plan was to hide this section entirely while the WhatsApp group
 * invite was missing. On reflection that throws away a working conversion: we
 * do have a real WhatsApp number, so the section stays and the button asks to
 * be added by hand instead. Same pattern as the sponsor deck — a section that
 * still converts beats a hidden one, and neither state is a dead link.
 *
 * Set `links.whatsappCommunity` and the button becomes a direct group invite
 * with no other change.
 */

export function Community() {
  const { copy, links, site } = siteConfig;
  const c = copy.community;
  const groupReady = Boolean(links.whatsappCommunity);

  const href = groupReady
    ? (links.whatsappCommunity as string)
    : `${links.whatsappChat}?text=${encodeURIComponent(
        `Hello — please add me to the ${site.name} community.`,
      )}`;

  return (
    <section
      id="community"
      className="bg-surface-2 relative scroll-mt-24 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="halftone-lg text-cta pointer-events-none absolute inset-0 opacity-[0.08]"
      />

      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-24">
        <p className="text-eyebrow text-cta font-bold">
          <span lang="hi">{c.eyebrow}</span>
        </p>

        <h2 className="font-display text-d1 mt-4 uppercase">{c.heading}</h2>

        <p className="text-lead text-ink mt-5">{c.body}</p>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-cta text-cta-ink hover:bg-ice mt-9 inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-extrabold transition-colors"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.03 0 1.2.87 2.35.99 2.51.12.17 1.72 2.62 4.16 3.68.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
          </svg>
          {groupReady ? c.ctaLabel : c.ctaPendingLabel}
        </a>

        {!groupReady ? (
          <p className="text-small text-ink mx-auto mt-4 max-w-md">
            {c.pendingNote}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default Community;
