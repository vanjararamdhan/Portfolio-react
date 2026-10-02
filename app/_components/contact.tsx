import type { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { LuArrowUpRight, LuDownload, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { RESUME_PATH, profile } from "../_data/portfolio";
import { ButtonLink, Container, vars } from "./ui";

type Channel = { icon: IconType; label: string; value: string; href?: string; external?: boolean };

const channels: Channel[] = [
  { icon: LuMail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: FaLinkedinIn, label: "LinkedIn", value: "in/ramdhan-vanjara", href: profile.linkedIn, external: true },
  { icon: LuPhone, label: "Phone", value: profile.phone, href: profile.phoneHref },
  { icon: FaGithub, label: "GitHub", value: "vanjararamdhan", href: profile.github, external: true },
  { icon: LuMapPin, label: "Location", value: `${profile.location} · ${profile.availability}` },
];

const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Opportunity for Ramdhan Vanjara")}`;

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden py-12 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[360px] w-[min(820px,100%)] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />
      <Container>
        <div data-reveal="scale" className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            <span className="text-subtle">09</span> · Contact
          </p>
          <h2 id="contact-heading" className="mt-4 text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl">
            Let&apos;s build something reliable.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            I&apos;m open to roles where I can contribute to backend architecture, distributed systems, APIs and
            full-stack product development, and I can start immediately.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={mailto}>
              Start a Conversation
              <LuArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={RESUME_PATH} download variant="secondary">
              <LuDownload aria-hidden className="size-4" />
              Download Resume
            </ButtonLink>
          </div>
        </div>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_0.9fr_1.15fr]">
          {channels.map(({ icon: Icon, label, value, href, external }, i) => {
            const body = (
              <>
                <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
                  <Icon aria-hidden className="size-3.5 text-accent transition-transform duration-200 group-hover:scale-125" />
                  {label}
                </span>
                <span className="mt-2 block break-words text-sm text-fg">
                  <span className="u-link">{value}</span>
                </span>
              </>
            );
            return (
              <li key={label} data-reveal style={vars({ "--i": i })} className="bg-surface sm:last:col-span-2 lg:last:col-span-1">
                {href ? (
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="ripple-host spotlight group block h-full p-5 transition-colors duration-300 hover:bg-surface-2"
                  >
                    {body}
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                ) : (
                  <div className="h-full p-5">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
