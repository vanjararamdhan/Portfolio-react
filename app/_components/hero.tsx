"use client";

import Image from "next/image";
import { useRef } from "react";
import { LuArrowDownRight, LuDownload } from "react-icons/lu";
import { PHOTO_PATH, RESUME_FILENAME, RESUME_PATH, profile } from "../_data/portfolio";
import { MQ, ScrollTrigger, gsap, useGSAP, whenIntroDone } from "../_lib/motion";
import SocialLinks from "./social-links";
import { ButtonLink, Container } from "./ui";

/** One line of the name, a clipping mask per letter so each can rise into place (and later scatter). */
function NameWord({ word, className = "" }: { word: string; className?: string }) {
  return (
    <span className={`block ${className}`}>
      {[...word].map((ch, i) => (
        <span key={i} className="hero-mask inline-block overflow-x-visible overflow-y-clip pb-[0.14em] -mb-[0.14em] align-top">
          <span className="hero-char inline-block">{ch}</span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Letters are pre-split in the markup (see <NameWord />), so nothing measures text at load.
        const chars = gsap.utils.toArray<HTMLElement>(".hero-char");
        const masks = gsap.utils.toArray<HTMLElement>(".hero-mask");

        // Entrance, once the intro curtain lifts.
        const intro = gsap.timeline({ paused: true });
        intro
          .set("[data-hero-hide]", { visibility: "visible" })
          .from(chars, { yPercent: 120, rotate: 6, duration: 1.2, stagger: 0.035, ease: "expo.out" })
          .fromTo(".hero-photo", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 0.1)
          .from(".hero-photo img", { scale: 1.3, duration: 1.8, ease: "expo.out" }, 0.1)
          .from(".hero-fade", { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08, ease: "power3.out" }, 0.45)
          .from(".hero-cue", { autoAlpha: 0, duration: 0.8 }, 1.1);
        const unlisten = whenIntroDone(() => intro.play());

        // Exit (desktop): the hero holds while the name scatters and the portrait closes to a slit.
        // The pin exists from the start (so page height never jumps), but the scrubbed animation is only
        // built once the entrance has finished: it animates the same properties, and building it earlier
        // would let it rewind them into the entrance's hidden starting state.
        const exit = gsap.matchMedia();
        exit.add(MQ.desktop, () => {
          const pin = ScrollTrigger.create({ trigger: root.current, start: "top top", end: "+=75%", pin: true, anticipatePin: 1 });
          // A trigger on an already-pinned element would measure from after the pin; borrow its range instead.
          const range = { trigger: root.current, start: () => pin.start, end: () => pin.end };

          let scrub: gsap.core.Timeline | null = null;
          const build = () => {
            // The letters' mask wrappers move (not the letters), so nothing is clipped as the name scatters.
            const mid = (masks.length - 1) / 2;
            scrub = gsap
              .timeline({ scrollTrigger: { ...range, scrub: 0.8 }, defaults: { ease: "none" } })
              .to(masks, { x: (i) => (i - mid) * 26, y: (i) => Math.sin(i * 1.7) * 70, rotate: (i) => (i - mid) * 3, autoAlpha: 0, stagger: { each: 0.004, from: "center" } }, 0)
              .to(".hero-fade", { y: -60, autoAlpha: 0, stagger: 0.02 }, 0)
              .to(".hero-photo", { clipPath: "inset(0% 47% 0% 47%)" }, 0.05)
              .to(".hero-photo img", { scale: 1.25 }, 0.05)
              .to(".hero-caption, .hero-cue", { autoAlpha: 0 }, 0);
          };
          if (intro.progress() === 1) build();
          else intro.eventCallback("onComplete", build);

          return () => {
            intro.eventCallback("onComplete", null);
            scrub?.scrollTrigger?.kill();
            scrub?.kill();
          };
        });

        return () => {
          unlisten();
          exit.revert();
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="home" data-tone="#0d0d0c" aria-labelledby="hero-heading" className="relative flex min-h-svh flex-col justify-center pt-24 pb-16 lg:pt-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <figure data-hero-hide className="mx-auto w-full max-w-[16rem] sm:max-w-[20rem] lg:order-2 lg:mx-0 lg:ml-auto lg:max-w-[25rem]">
            <div className="crop-marks">
              <div className="hero-photo relative aspect-square overflow-hidden bg-surface">
                <Image
                  src={PHOTO_PATH}
                  alt={`${profile.name}, ${profile.role}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 320px, 256px"
                  className="object-cover"
                />
              </div>
            </div>
            <figcaption className="hero-caption label mt-5 flex items-center justify-between gap-4 whitespace-nowrap">
              <span>
                <span className="text-accent">Fig. 01</span> · {profile.location}
              </span>
              <span className="hidden lg:inline">Node.js · TypeScript · Kafka</span>
            </figcaption>
          </figure>

          <div className="lg:order-1">
            <p data-hero-hide className="hero-fade label mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-2 text-fg">
                <span className="relative flex size-2" aria-hidden>
                  <span className="pulse-dot absolute inset-0 rounded-full bg-live" />
                  <span className="relative size-2 rounded-full bg-live" />
                </span>
                Open to opportunities
              </span>
              <span aria-hidden>/</span>
              <span>{profile.availability}</span>
            </p>

            <h1 id="hero-heading" className="display text-[4.5rem] text-fg sm:text-[7rem] lg:text-[8rem] xl:text-[9.5rem]">
              <span className="sr-only">{profile.name}</span>
              <span aria-hidden data-hero-hide className="block">
                <NameWord word="Ramdhan" />
                <NameWord word="Vanjara" className="italic text-accent" />
              </span>
            </h1>

            <p data-hero-hide className="hero-fade mt-6 text-lg font-medium tracking-tight text-fg sm:text-xl">
              {profile.role} <span className="text-subtle">— {profile.focus}</span>
            </p>

            <p data-hero-hide className="hero-fade mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              I build scalable Node.js and TypeScript systems: event-driven Kafka pipelines, microservices and REST/GraphQL
              APIs for clients in South Africa, Israel and Poland, across travel, insurance, healthcare, EdTech and AI.
            </p>

            <div data-hero-hide className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={RESUME_PATH} download={RESUME_FILENAME} type="application/pdf" data-magnetic data-cursor="Save">
                <LuDownload aria-hidden className="size-4 transition-transform group-hover:translate-y-0.5" />
                Download Resume
              </ButtonLink>
              <ButtonLink href="#contact" variant="secondary" data-magnetic>
                Contact Me
                <LuArrowDownRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </ButtonLink>
              <SocialLinks className="mt-2 sm:ml-2 sm:mt-0" />
            </div>
          </div>
        </div>
      </Container>

      <div data-hero-hide aria-hidden className="hero-cue absolute inset-x-0 bottom-6 hidden justify-center lg:flex">
        <span className="label flex flex-col items-center gap-3">
          Scroll
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-accent" />
          </span>
        </span>
      </div>
    </section>
  );
}
