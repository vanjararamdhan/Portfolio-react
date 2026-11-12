"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { MQ, ScrollTrigger, SplitText, gsap, smooth, stream } from "../_lib/motion";

/**
 * Page-wide scroll orchestration, wired once:
 *  - Lenis smooth scrolling on desktop (native scrolling stays the source of truth, so the
 *    wheel, keyboard, scrollbar and anchor links all keep working), synced to ScrollTrigger
 *  - each section's [data-tone] background colour, crossfaded as it takes the screen
 *  - the WebGL stream's formation: hero partitions → ambient drift → contact convergence
 */
export default function Scenes() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ.fine, () => {
      const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 }, autoRaf: false });
      smooth.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        smooth.lenis = null;
      };
    });

    mm.add(MQ.motion, () => {
      // Background tone per section.
      const body = document.body;
      const base = getComputedStyle(body).backgroundColor;
      document.querySelectorAll<HTMLElement>("[data-tone]").forEach((section) => {
        const tone = section.dataset.tone!;
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) gsap.to(body, { backgroundColor: tone, duration: 1.1, ease: "power2.out", overwrite: true });
          },
        });
      });

      // Stream formation: the hero's partitions dissolve as About arrives, and converge as Contact does.
      // (Measured from About because the hero itself is pinned.)
      const hero = ScrollTrigger.create({ trigger: "#about", start: "top bottom", end: "top 35%" });
      const contact = ScrollTrigger.create({ trigger: "#contact", start: "top bottom", end: "top 25%" });
      const tick = () => {
        const h = hero.progress;
        const c = contact.progress;
        stream.formation = h + c;
        stream.intensity = c > 0 ? 0.4 + 0.6 * c : 1 - 0.6 * h;
      };
      gsap.ticker.add(tick);

      // Section titles rise line by line out of a mask. Each is split only as it approaches the screen
      // (splitting measures text, so doing all of them at load would stall startup), then plays once.
      const splits: SplitText[] = [];
      const near = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            near.unobserve(entry.target);
            const el = entry.target as HTMLElement;
            const split = SplitText.create(el, { type: "lines", mask: "lines" });
            splits.push(split);
            gsap.from(split.lines, {
              yPercent: 110,
              duration: 1.2,
              stagger: 0.09,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
              // Lines are re-flowable text again once they've landed.
              onComplete: () => split.revert(),
            });
          }
        },
        { rootMargin: "0px 0px 35% 0px" },
      );
      gsap.utils.toArray<HTMLElement>("[data-split-lines]").forEach((el) => near.observe(el));

      // The footer slides up from underneath as the page runs out.
      gsap.from("[data-footer] .footer-inner", {
        yPercent: -60,
        autoAlpha: 0.4,
        ease: "none",
        scrollTrigger: { trigger: "[data-footer]", start: "top bottom", end: "bottom bottom", scrub: true },
      });

      // Fonts and images change layout heights; re-measure once they're in.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        gsap.ticker.remove(tick);
        near.disconnect();
        splits.forEach((s) => s.revert());
        gsap.set(body, { backgroundColor: base });
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
