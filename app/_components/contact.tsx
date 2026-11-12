"use client";

import { useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { LuArrowUpRight, LuCheck, LuDownload, LuMapPin, LuPhone, LuSend } from "react-icons/lu";
import { RESUME_FILENAME, RESUME_PATH, profile } from "../_data/portfolio";
import { MQ, emitBurst, gsap, prefersReducedMotion, useGSAP } from "../_lib/motion";
import CopyEmail from "./copy-email";
import { ButtonLink, Container, vars } from "./ui";

type Channel = { icon: IconType; label: string; value: string; href?: string; external?: boolean };

const channels: Channel[] = [
  { icon: LuPhone, label: "Phone", value: profile.phone, href: profile.phoneHref },
  { icon: FaLinkedinIn, label: "LinkedIn", value: profile.linkedInHandle, href: profile.linkedIn, external: true },
  { icon: FaGithub, label: "GitHub", value: profile.githubHandle, href: profile.github, external: true },
  { icon: LuMapPin, label: "Location", value: `${profile.location} · ${profile.availability}` },
];

const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Opportunity for Ramdhan Vanjara")}`;

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  // The email ripples under the cursor: letters near the pointer lift, like a wave through the stream.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.fine, () => {
        const wrap = root.current!.querySelector<HTMLElement>(".email-wave")!;
        const letters = gsap.utils.toArray<HTMLElement>(".email-wave [data-ch]");
        // Built on first hover: one tween per letter isn't worth measuring at page load.
        let lifts: ((v: number) => void)[] = [];
        const move = (e: PointerEvent) => {
          if (!lifts.length) lifts = letters.map((el) => gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" }));
          letters.forEach((el, i) => {
            const r = el.getBoundingClientRect();
            const d = Math.abs(e.clientX - (r.left + r.width / 2));
            lifts[i](-Math.max(0, 1 - d / 110) * 16);
          });
        };
        const leave = () => lifts.forEach((lift) => lift(0));
        wrap.addEventListener("pointermove", move);
        wrap.addEventListener("pointerleave", leave);
        return () => {
          wrap.removeEventListener("pointermove", move);
          wrap.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  // Send an event: a pulse leaves the button through the stream, then the mail app opens.
  const send = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion()) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    emitBurst(r.left + r.width / 2, r.top + r.height / 2);
    setSent(true);
    window.setTimeout(() => {
      window.location.href = mailto;
    }, 550);
    window.setTimeout(() => setSent(false), 3000);
  };

  return (
    <section ref={root} id="contact" data-tone="#120e08" aria-labelledby="contact-heading" className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="relative mb-6 h-px bg-line">
          <span aria-hidden className="absolute inset-y-0 left-0 w-24 bg-accent" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:gap-10">
          <p className="label flex items-baseline gap-3 lg:pt-3">
            <span className="text-accent">07</span>
            <span>Contact</span>
          </p>

          <div>
            <h2 id="contact-heading" data-split-lines className="display text-5xl text-fg sm:text-7xl lg:text-[6.5rem]">
              Let&apos;s build something <em className="text-accent">reliable.</em>
            </h2>
            <p data-reveal className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Open to senior backend and full-stack roles: architecture, distributed systems, APIs and integrations. I can join
              immediately.
            </p>

            <a
              href={mailto}
              data-cursor="Write"
              aria-label={`Email ${profile.email}`}
              className="email-wave group mt-12 inline-flex max-w-full items-center gap-3 text-fg transition-colors hover:text-accent"
            >
              <span aria-hidden className="display break-all text-[1.85rem] sm:text-5xl lg:text-[4.25rem]">
                {[...profile.email].map((ch, i) => (
                  <span key={i} data-ch className="inline-block">
                    {ch}
                  </span>
                ))}
              </span>
              <LuArrowUpRight aria-hidden className="size-6 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:size-9" />
            </a>

            <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ButtonLink href={mailto} onClick={send} data-magnetic data-cursor="Send">
                {sent ? <LuCheck aria-hidden className="size-4" /> : <LuSend aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                <span aria-live="polite">{sent ? "Event sent · opening mail" : "Send an event"}</span>
              </ButtonLink>
              <ButtonLink href={RESUME_PATH} download={RESUME_FILENAME} type="application/pdf" variant="secondary" data-magnetic data-cursor="Save">
                <LuDownload aria-hidden className="size-4 transition-transform group-hover:translate-y-0.5" />
                Download Resume
              </ButtonLink>
              <CopyEmail email={profile.email} />
            </div>

            <ul className="mt-16 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
              {channels.map(({ icon: Icon, label, value, href, external }, i) => {
                const body = (
                  <>
                    <span className="label flex items-center gap-2">
                      <Icon aria-hidden className="size-3.5 text-accent" />
                      {label}
                    </span>
                    <span className="mt-2 block break-words text-sm text-fg">
                      <span className={href ? "u-link" : ""}>{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label} data-reveal style={vars({ "--i": i })} className="border-b border-line">
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="block h-full py-5 pr-4 transition-colors hover:bg-fg/[0.02]"
                      >
                        {body}
                        {external && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    ) : (
                      <div className="h-full py-5 pr-4">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
