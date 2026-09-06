/**
 * SECTION PLACEHOLDER — TEMPORARY
 * ================================
 * Stands in for each real section so the scroll skeleton, the sticky nav
 * behaviour and the anchor links can be reviewed before the sections exist.
 *
 * DELETE THIS FILE once every section is built. Nothing else should import it.
 */

export function SectionPlaceholder({
  id,
  n,
  eyebrow,
  title,
  note,
  tone = "dark",
  minH = "min-h-[70vh]",
  children,
  ...rest
}: {
  id: string;
  n: string;
  eyebrow?: string;
  title: string;
  note: string;
  tone?: "dark" | "violet" | "light";
  minH?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const tones = {
    dark: "bg-surface text-ink",
    violet: "bg-surface-2 text-ink",
    light: "bg-surface-light text-ink-dark",
  };

  const muted = tone === "light" ? "text-ink-muted-dark" : "text-ink-muted";
  const accent = tone === "light" ? "text-brand" : "text-cta";

  return (
    <section
      id={id}
      // scroll-mt clears the fixed nav so anchor links do not land underneath it.
      className={`${tones[tone]} ${minH} scroll-mt-20 border-b border-current/10`}
      {...rest}
    >
      <div className="mx-auto flex max-w-7xl flex-col justify-center px-5 py-20 sm:px-8">
        <div className="flex items-baseline gap-4">
          <span className={`font-display text-d3 leading-none ${accent}`}>
            {n}
          </span>
          {eyebrow ? (
            <span
              className={`text-eyebrow font-body font-bold uppercase ${accent}`}
            >
              {eyebrow}
            </span>
          ) : null}
        </div>

        <h2 className="font-display text-d1 mt-4">{title}</h2>
        <p className={`text-lead mt-5 max-w-2xl ${muted}`}>{note}</p>

        {children}
      </div>
    </section>
  );
}

export default SectionPlaceholder;
