import siteConfig, { type Social } from "@/content/site.config";

/**
 * SOCIAL LINKS
 * ============
 * Driven entirely by `socials` in site.config.ts. Renders NOTHING when the
 * array is empty — no placeholder icons, no dead links, no "coming soon"
 * badges. Accounts do not exist yet, so nothing appears.
 *
 * To switch on: add an entry to `socials` and set `flags.showSocials` to true.
 * Both are required, so the array can be filled in and staged before the
 * icons go live.
 */

const ICONS: Record<Social["icon"], React.ReactNode> = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="4.5" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5h2.2V5.4h-2.6c-2.4 0-3.9 1.5-3.9 4v2.1H7.8v3.1h2.4V22h3.3v-7.4h2.5l.4-3.1h-2.9V9.7c0-.8.3-1.2 1-1.2z" />
  ),
};

export function SocialLinks({
  className = "",
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  const { socials, flags } = siteConfig;

  // Nothing to show. Render nothing at all — not an empty <ul>.
  if (!flags.showSocials || socials.length === 0) return null;

  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {socials.map((s) => (
        <li key={s.href}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${siteConfig.site.name} on ${s.label}`}
            className="border-rule text-ink hover:border-cta hover:text-cta grid size-11 place-items-center rounded-full border transition-colors"
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              {ICONS[s.icon]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default SocialLinks;
