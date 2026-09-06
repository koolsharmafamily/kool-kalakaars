import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * BUTTON
 * ======
 * Renders an <a> when `href` is set and a <button> otherwise, so a link is
 * always a real link (middle-click, open-in-new-tab, and the browser status
 * bar all keep working) and an action is always a real button.
 *
 * Every state below is measured, and every state passes WCAG AA for normal
 * body text. Ratios:
 *   primary   rest  acid fill / indigo label     8.49:1  AAA
 *             hover magenta fill / ice label     4.98:1  AA
 *   secondary rest  ice outline / ice label     10.48:1  AAA
 *             hover ice fill / indigo label     10.48:1  AAA
 *   ghost     rest  ice label                   10.48:1  AAA
 *   onLight   rest  indigo fill / ice label     10.48:1  AAA
 *             hover magenta fill / ice label     4.98:1  AA
 *
 * Note on flame: it is deliberately NOT used as a button fill. Flame with an
 * ice label is 2.81:1 and with an indigo label 3.73:1 — both fail AA at body
 * size. Flame stays where the brief put it, on display-scale accents.
 *
 * Hover uses transform only — never box-shadow or filter — and is disabled
 * under prefers-reduced-motion.
 */

type Variant = "primary" | "secondary" | "ghost" | "onLight";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // Acid fill with indigo text. The single loudest thing on any screen.
  // Hover shifts to the brand magenta rather than flame — see note above.
  primary:
    "bg-cta text-cta-ink border-cta hover:bg-brand hover:border-brand hover:text-ice",
  // Outlined. Sits next to primary without competing with it.
  secondary:
    "bg-transparent text-ink border-ice hover:bg-ice hover:text-indigo",
  // No chrome until you touch it.
  ghost:
    "bg-transparent text-ink border-transparent hover:border-ice/40 hover:bg-ice/10",
  // For use on the ice-coloured light sections.
  onLight:
    "bg-indigo text-ice border-indigo hover:bg-magenta hover:border-magenta",
};

const SIZES: Record<Size, string> = {
  sm: "text-small px-4 py-2 gap-2",
  md: "text-body px-6 py-3 gap-2.5",
  // Large enough to be an easy thumb target at 360px.
  lg: "text-lead px-8 py-4 gap-3",
};

const BASE = [
  "inline-flex items-center justify-center",
  "font-body font-extrabold tracking-tight",
  "border-2 rounded-full",
  "cursor-pointer select-none",
  "transition-[transform,background-color,border-color,color] duration-200 ease-out",
  // Transform-only hover lift. Composited, so it costs nothing to paint.
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
  // Disabled and loading both read as "not right now".
  "disabled:pointer-events-none disabled:opacity-45",
  "aria-disabled:pointer-events-none aria-disabled:opacity-45",
].join(" ");

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /**
   * Spoken label. Set this whenever the visible text is Hinglish or otherwise
   * not the plain-English name of the action — e.g. children "Chalo, register
   * karo" with label "Register".
   */
  label?: string;
  /** Shows a spinner and blocks interaction. */
  loading?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps> & {
    href: string;
    /** Set for links that leave the site. Adds rel and a new tab. */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
    />
  );
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    children,
    label,
    loading = false,
  } = props;

  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {loading ? <Spinner /> : null}
      <span>{children}</span>
    </>
  );

  if (props.href !== undefined) {
    const { href, external, variant: _v, size: _s, className: _c, children: _ch, label: _l, loading: _lo, ...rest } = props;

    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    // next/link for in-site routes and hash anchors; a plain anchor for
    // anything that leaves the origin.
    const isInternal = href.startsWith("/") || href.startsWith("#");
    const Tag = isInternal ? Link : "a";

    return (
      <Tag
        href={href}
        aria-label={label}
        className={classes}
        {...externalProps}
        {...rest}
      >
        {content}
      </Tag>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, label: _l, loading: _lo, ...rest } = props;

  return (
    <button
      aria-label={label}
      aria-busy={loading || undefined}
      disabled={loading || rest.disabled}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
}

export default Button;
