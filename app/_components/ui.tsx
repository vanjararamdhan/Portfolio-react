import { Fragment, type AnchorHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { LuArrowRight } from "react-icons/lu";
import { TechIcon } from "./tech-icon";

/** Typed inline CSS custom properties, e.g. stagger indexes for the motion system. */
export const vars = (v: Record<`--${string}`, string | number>) => v as CSSProperties;

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type SectionProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({ id, index, eyebrow, title, intro, children, className = "" }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`relative py-12 sm:py-14 lg:py-16 ${className}`}>
      <div aria-hidden className="section-seam" />
      <Container>
        <header className="mb-8 max-w-3xl sm:mb-10" data-reveal>
          <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">
            <span className="text-subtle">{index}</span>
            <span aria-hidden className="reveal-line h-px w-8 bg-gradient-to-r from-brand to-transparent" />
            {eyebrow}
          </p>
          <h2 id={headingId} className="reveal-mask text-3xl font-semibold tracking-tight text-fg sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            {title}
          </h2>
          {intro && <p className="reveal-sub mt-4 text-base leading-relaxed text-subtle sm:text-lg">{intro}</p>}
        </header>
        {children}
      </Container>
    </section>
  );
}

/** Row of technology badges that pop in, staggered, when their section reveals. */
export function ChipList({ items, className = "", label, nudge = false }: { items: string[]; className?: string; label?: string; nudge?: boolean }) {
  return (
    <ul className={`pop flex flex-wrap gap-1.5 ${nudge ? "nudge" : ""} ${className}`} aria-label={label}>
      {items.map((t, j) => (
        <li key={t} style={vars({ "--j": j })}>
          <Chip>{t}</Chip>
        </li>
      ))}
    </ul>
  );
}

/** Left-to-right pipeline of steps; arrows pulse in sequence to show data moving. */
export function Flow({ steps }: { steps: string[] }) {
  return (
    <ol
      aria-label="Data flow"
      className="pop flex flex-col items-stretch gap-2 rounded-xl border border-line bg-bg/60 p-4 sm:flex-row sm:flex-wrap sm:items-center"
    >
      {steps.map((step, i) => (
        <Fragment key={step}>
          <li
            style={vars({ "--j": i * 2 })}
            className={`rounded-lg border px-3 py-2 text-center font-mono text-xs ${
              i === 1 ? "border-accent/50 bg-accent/10 text-accent-strong" : "border-line-strong bg-surface-2 text-fg"
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

/** Technology tag; shows the technology's logo when one is known. */
export function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/60 px-2 py-0.5 font-mono text-[0.72rem] leading-5 text-muted">
      <TechIcon name={children} brand className="size-3" />
      {children}
    </span>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

const variants = {
  primary:
    "bg-gradient-to-b from-brand to-brand-deep text-white shadow-[0_0_0_1px_rgb(139_92_246/0.5),0_8px_28px_-8px_rgb(139_92_246/0.6)] hover:brightness-110 hover:shadow-[0_0_0_1px_rgb(167_139_250/0.6),0_10px_34px_-8px_rgb(139_92_246/0.75)]",
  secondary: "border border-line-strong bg-surface/40 text-fg hover:border-brand/60 hover:bg-surface-2",
  ghost: "text-subtle hover:text-fg",
} as const;

export function ButtonLink({ variant = "primary", className = "", children, ...props }: ButtonLinkProps) {
  return (
    <a
      className={`ripple-host group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-[background-color,border-color,color,box-shadow,translate,scale,filter,transform] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
