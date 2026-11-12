"use client";

import Image from "next/image";
import { useRef } from "react";
import { PHOTO_PATH, aboutFacts, aboutStats, experiences } from "../_data/portfolio";
import { MQ, ScrollTrigger, gsap, useGSAP } from "../_lib/motion";
import { Container, vars } from "./ui";

// The statement, pre-split into words so scroll can light them one by one without measuring text.
const STATEMENT: { text: string; accent?: boolean }[] = [
  { text: "I’m a backend engineer for systems where" },
  { text: "data has to be right", accent: true },
  { text: ": 4.5+ years across three companies, building scalable Node.js and TypeScript systems for clients in South Africa, Israel and Poland." },
];
// Each segment as words, numbered across the whole statement.
const SEGMENTS = STATEMENT.reduce<{ accent?: boolean; lead: string; words: { w: string; i: number }[] }[]>((acc, seg) => {
  const start = acc.reduce((n, s) => n + s.words.length, 0);
  const words = seg.text.trim().split(/\s+/).map((w, j) => ({ w, i: start + j }));
  // A segment starting with punctuation hugs the previous word; otherwise it needs a space.
  const lead = acc.length && !/^[:,.;]/.test(seg.text) ? " " : "";
  return [...acc, { accent: seg.accent, lead, words }];
}, []);
const WORD_COUNT = SEGMENTS.reduce((n, s) => n + s.words.length, 0);

function Statement() {
  return SEGMENTS.map((seg, k) => {
    const words = seg.words.flatMap(({ w, i }, j) => [
      j ? " " : "",
      <span key={i} className="lit-word" style={vars({ "--i": i })}>
        {w}
      </span>,
    ]);
    return (
      <span key={k}>
        {seg.lead}
        {seg.accent ? <em className="text-accent">{words}</em> : words}
      </span>
    );
  });
}

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // The statement lights up word by word as it scrolls through the screen: scroll drives a single
        // CSS variable and each word derives its own opacity from it (see .lit-word).
        const statement = root.current!.querySelector<HTMLElement>(".about-statement")!;
        statement.style.setProperty("--p", "0");
        ScrollTrigger.create({
          trigger: statement,
          start: "top 80%",
          end: "bottom 45%",
          onUpdate: (self) => statement.style.setProperty("--p", self.progress.toFixed(3)),
        });

        // The portrait reopens from the slit the hero closed it into.
        gsap.fromTo(
          ".about-photo",
          { clipPath: "inset(0% 47% 0% 47%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "expo.inOut", duration: 1.4, scrollTrigger: { trigger: ".about-photo", start: "top 85%", once: true } },
        );

        // Counters tick up like live metrics.
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const decimals = Number(el.dataset.decimals ?? 0);
          const prefix = el.dataset.prefix ?? "";
          const suffix = el.dataset.suffix ?? "";
          const state = { v: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () =>
              gsap.to(state, {
                v: target,
                duration: 1.6,
                ease: "power3.out",
                onUpdate: () => {
                  el.textContent = `${prefix}${state.v.toFixed(decimals)}${suffix}`;
                },
              }),
          });
        });

      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" data-tone="#100e0b" aria-labelledby="about-heading" className="relative pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:gap-10">
          <p className="label flex items-baseline gap-3 lg:pt-4">
            <span className="text-accent">01</span>
            <span>About</span>
          </p>
          <h2
            id="about-heading"
            className="about-statement display max-w-5xl text-[2.3rem] leading-[1.05] text-fg sm:text-5xl lg:text-[4rem]"
            style={vars({ "--n": WORD_COUNT })}
          >
            <Statement />
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[14rem_1fr] lg:gap-10">
          <div className="about-photo relative hidden aspect-[3/4] overflow-hidden bg-surface lg:block">
            <Image src={PHOTO_PATH} alt="" fill sizes="224px" className="object-cover object-[50%_30%]" />
          </div>

          <div className="grid gap-12 xl:grid-cols-[1fr_1.1fr] xl:gap-16">
            <div className="space-y-5 text-base leading-relaxed text-muted sm:text-[1.0625rem]">
              <p data-reveal>
                Most recently I built Kafka pipelines syncing <strong className="font-medium text-fg">1–2 million records a day</strong>{" "}
                and integrated five Zoho apps across three client platforms. Before that I worked on Marcel, Publicis Groupe&apos;s
                AI platform, and led a <strong className="font-medium text-fg">10-member backend team</strong> for 2.5 years, owning
                architecture decisions, code reviews and client communication.
              </p>
              <p data-reveal style={vars({ "--i": 1 })}>
                I care about the parts that keep production calm: APIs secured with OAuth 2.0 and JWT, queries rewritten until
                they&apos;re fast, and 100% unit-test coverage on the modules I deliver. I use Claude Code and GitHub Copilot
                every day.
              </p>
              <dl className="mt-10! border-t border-line">
                {aboutFacts.map((f, i) => (
                  <div key={f.label} data-reveal style={vars({ "--i": i })} className="grid gap-1.5 border-b border-line py-3.5 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
                    <dt className="label sm:pt-0.5">{f.label}</dt>
                    <dd className="text-sm leading-relaxed text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <ul className="grid grid-cols-2 border-l border-t border-line">
                {aboutStats.map((s) => (
                  <li key={s.label} className="spotlight border-b border-r border-line p-5 sm:p-6">
                    <p className="display text-5xl tabular-nums text-fg sm:text-6xl">
                      <span
                        data-count={s.count}
                        data-decimals={s.decimals}
                        data-prefix={s.prefix}
                        data-suffix={s.suffix}
                      >
                        {s.value}
                      </span>
                    </p>
                    <p className="label mt-3 normal-case tracking-normal">{s.label}</p>
                  </li>
                ))}
              </ul>
              <p className="label mt-5">
                Experience at <span className="text-muted">{experiences.map((e) => e.company).join("  ·  ")}</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
