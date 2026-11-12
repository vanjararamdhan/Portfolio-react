import { Fragment, type AnchorHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { LuArrowRight } from "react-icons/lu";
import { TechIcon } from "./tech-icon";

/** Typed inline CSS custom properties, e.g. stagger indexes for the motion system. */
export const vars = (v: Record<`--${string}`, string | number>) => v as CSSProperties;

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[74rem] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

type SectionProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Background colour the page crossfades to while this section has the screen. */
  tone?: string;
};

/** Spec-sheet section: a ruled header with the index on the left and a serif title on the right. */
export function Section({ id, index, eyebrow, title, intro, children, className = "", tone }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} data-tone={tone} aria-labelledby={headingId} className={`relative py-20 sm:py-24 lg:py-32 ${className}`}>
      <Container>
        <header data-reveal className="mb-12 sm:mb-16">
          <div className="relative mb-6 h-px bg-line">
            <span aria-hidden className="reveal-line absolute inset-y-0 left-0 w-24 bg-accent" />
          </div>
          <div className="grid gap-4 lg:grid-cols-[14rem_1fr] lg:gap-10">
            <p className="label flex items-baseline gap-3 lg:pt-3">
              <span className="text-accent">{index}</span>
              <span>{eyebrow}</span>
            </p>
            <div className="max-w-3xl">
              <h2 id={headingId} data-split-lines className="display text-[2.6rem] text-fg sm:text-6xl lg:text-[4.75rem]">
                {title}
              </h2>
              {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed text-subtle sm:text-lg">{intro}</p>}
            </div>
          </div>
        </header>
        {children}
      </Container>
    </section>
  );
}

/** Row of technology tags that fade in, staggered, when their section reveals. */
export function ChipList({ items, className = "", label }: { items: string[]; className?: string; label?: string }) {
  return (
    <ul className={`pop flex flex-wrap gap-1.5 ${className}`} aria-label={label}>
      {items.map((t, j) => (
        <li key={t} style={vars({ "--j": j })}>
          <Chip>{t}</Chip>
        </li>
      ))}
    </ul>
  );
}

/** Technology tag; shows the technology's logo when one is known. */
export function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[0.7rem] leading-5 text-muted">
      <TechIcon name={children} brand className="size-3" />
      {children}
    </span>
  );
}

/** Left-to-right pipeline of steps; arrows pulse in sequence to show data moving. */
export function Flow({ steps, highlight = 1 }: { steps: string[]; highlight?: number }) {
  return (
    <ol aria-label="Data flow" className="pop flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {steps.map((step, i) => (
        <Fragment key={step}>
          <li
            style={vars({ "--j": i * 2 })}
            className={`rounded-md border px-3 py-2 text-center font-mono text-xs ${
              i === highlight ? "border-accent/60 bg-accent/10 text-accent-strong" : "border-line-strong bg-surface text-fg"
            }`}
          >
            {step}
          </li>
          {i < steps.length - 1 && (
            <li aria-hidden style={vars({ "--j": i * 2 + 1 })} className="flex justify-center text-accent">
              <LuArrowRight className="flow-arrow size-4 rotate-90 sm:rotate-0" style={vars({ "--k": i })} />
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary";
  children: ReactNode;
};

const variants = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong",
  secondary: "border border-line-strong text-fg hover:border-fg/60 hover:bg-fg/[0.04]",
} as const;

export function ButtonLink({ variant = "primary", className = "", children, ...props }: ButtonLinkProps) {
  return (
    <a
      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-[background-color,border-color,color,translate,scale] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
