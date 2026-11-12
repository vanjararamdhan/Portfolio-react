"use client";

import { useRef } from "react";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { experiences } from "../_data/portfolio";
import { MQ, gsap, useGSAP } from "../_lib/motion";
import { ChipList, Container } from "./ui";

// The journey reads left to right, oldest to newest.
const journey = [...experiences].reverse();
const HORIZONTAL = `${MQ.desktop} and (min-height: 680px)`;

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ horizontal: HORIZONTAL, motion: MQ.motion }, (ctx) => {
        const { horizontal, motion } = ctx.conditions as { horizontal: boolean; motion: boolean };
        if (!motion) return;
        // Everywhere but wide desktops: a vertical track that draws as you scroll.
        if (!horizontal) {
          gsap.fromTo(
            ".exp-vline",
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".exp-track", start: "top 70%", end: "bottom 70%", scrub: true } },
          );
          return;
        }

        // Desktop: the section pins and the career scrolls sideways; a particle rides the rail.
        const section = root.current!;
        section.dataset.mode = "h";
        const track = section.querySelector<HTMLElement>(".exp-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        tl.to(track, { x: () => -distance() }, 0).fromTo(".exp-fill", { scaleX: 0 }, { scaleX: 1 }, 0);
        // Each panel's content drifts slightly slower than the track, for depth.
        gsap.utils.toArray<HTMLElement>(".exp-panel-inner").forEach((inner) => {
          gsap.fromTo(
            inner,
            { xPercent: 8, autoAlpha: 0.3 },
            {
              xPercent: -4,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: { trigger: inner.parentElement, containerAnimation: tl, start: "left 95%", end: "left 25%", scrub: true },
            },
          );
        });
        return () => {
          delete section.dataset.mode;
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" data-tone="#0a0c0d" aria-labelledby="experience-heading" className="group/exp relative">
      <div className="relative group-data-[mode=h]/exp:h-svh group-data-[mode=h]/exp:overflow-hidden">
        <div className="exp-track relative flex flex-col group-data-[mode=h]/exp:h-full group-data-[mode=h]/exp:w-max group-data-[mode=h]/exp:flex-row">
          {/* Vertical progress line (non-horizontal layouts). */}
          <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-line group-data-[mode=h]/exp:hidden sm:left-6 lg:left-10" />
          <span aria-hidden className="exp-vline absolute bottom-0 left-4 top-0 w-px origin-top bg-accent group-data-[mode=h]/exp:hidden sm:left-6 lg:left-10" />

          <header className="flex shrink-0 flex-col justify-center py-20 group-data-[mode=h]/exp:w-[62vw] group-data-[mode=h]/exp:py-0 group-data-[mode=h]/exp:pl-[max(2.5rem,calc((100vw-74rem)/2+2.5rem))]">
            <Container className="pl-10! sm:pl-14! group-data-[mode=h]/exp:p-0! group-data-[mode=h]/exp:m-0">
              <p className="label flex items-baseline gap-3">
                <span className="text-accent">02</span>
                <span>Experience</span>
              </p>
              <h2 id="experience-heading" className="display mt-6 max-w-3xl text-[2.6rem] text-fg sm:text-6xl lg:text-[5.5rem]">
                Where I&apos;ve shipped <em className="text-accent">production systems.</em>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-subtle sm:text-lg">
                Three companies, 2022 to 2026: from leading a backend team to enterprise AI at Publicis and Kafka pipelines at Odek
                Appcraft.
              </p>
              <p className="label mt-10 hidden items-center gap-3 text-fg group-data-[mode=h]/exp:flex">
                Keep scrolling <LuArrowRight aria-hidden className="size-4 text-accent" />
              </p>
            </Container>
          </header>

          {journey.map((job, i) => (
            <article
              key={job.company}
              className="relative flex shrink-0 items-center border-t border-line py-14 group-data-[mode=h]/exp:h-full group-data-[mode=h]/exp:w-[min(86vw,76rem)] group-data-[mode=h]/exp:border-l group-data-[mode=h]/exp:border-t-0 group-data-[mode=h]/exp:py-24"
            >
              <span aria-hidden className="absolute left-[11px] top-16 size-[11px] rounded-full border border-accent bg-accent group-data-[mode=h]/exp:hidden sm:left-[19px] lg:left-[35px]" />
              <Container className="exp-panel-inner pl-10! sm:pl-14! group-data-[mode=h]/exp:px-14! group-data-[mode=h]/exp:max-w-none">
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
                  <div>
                    <p className="label">
                      <span className="text-accent">Stop {String(i + 1).padStart(2, "0")}</span> · {job.period} · {job.location}
                    </p>
                    <h3 className="display mt-5 text-4xl text-fg sm:text-5xl xl:text-6xl">{job.role}</h3>
                    <p className="display mt-2 text-3xl italic text-muted sm:text-4xl">{job.company}</p>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-subtle">{job.context}</p>

                    {job.projects && (
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {job.projects.map((p) => (
                          <li key={p.name}>
                            <a
                              href={`#project-${p.projectId}`}
                              data-cursor="Open"
                              className="group inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm text-fg transition-colors hover:border-accent/70 hover:bg-accent/10"
                            >
                              {p.name}
                              <LuArrowUpRight aria-hidden className="size-3.5 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    <ChipList items={job.stack} label={`${job.company} stack`} className="mt-6" />
                  </div>

                  <ul className="space-y-3.5 self-center">
                    {job.highlights.map((h) => (
                      <li key={h} className="grid grid-cols-[1.25rem_1fr] text-[0.95rem] leading-relaxed text-muted">
                        <span aria-hidden className="mt-[0.7rem] h-px w-2.5 bg-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </Container>
            </article>
          ))}
        </div>

        {/* Horizontal mode: the rail a particle rides from 2022 to 2026. */}
        <div aria-hidden className="absolute inset-x-0 bottom-10 hidden group-data-[mode=h]/exp:block">
          <Container>
            <div className="relative h-px bg-line">
              <span className="exp-fill absolute inset-0 origin-left bg-accent">
                <span className="absolute -right-1.5 -top-1.5 size-3 rounded-full bg-accent shadow-[0_0_18px_4px_rgb(242_164_58/0.6)]" />
              </span>
            </div>
            <div className="label mt-4 flex justify-between">
              <span>2022 · Surat</span>
              {journey.map((j) => (
                <span key={j.company}>{j.company.replace(" Pvt. Ltd.", "")}</span>
              ))}
              <span>2026 · Pune</span>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
