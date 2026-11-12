"use client";

import { useEffect, useRef } from "react";
import { navItems } from "../_data/portfolio";
import { ScrollTrigger, gsap } from "../_lib/motion";

const OFFSET_MAX = 2048;
const stages = [{ id: "home", label: "Hero" }, ...navItems];

/**
 * The visitor is an event moving through the pipeline: a rail on the left edge (desktop) fills with
 * scroll progress, a counter shows the "offset", and the current section is named. On small screens
 * it collapses to a thin bar under the header.
 */
export default function ProgressRail() {
  const fillRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const offsetRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setFill = gsap.quickSetter(fillRef.current, "scaleY");
    const setBar = gsap.quickSetter(barRef.current, "scaleX");
    // Created before the pinned scenes mount, so refresh after them (pins add scroll distance).
    const page = ScrollTrigger.create({
      refreshPriority: -1,
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setFill(self.progress);
        setBar(self.progress);
        if (offsetRef.current) offsetRef.current.textContent = String(Math.round(self.progress * OFFSET_MAX)).padStart(4, "0");
      },
    });

    const triggers = stages.map(({ id, label }, i) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        refreshPriority: -1,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive && stageRef.current) stageRef.current.textContent = `${String(i).padStart(2, "0")} · ${label}`;
          // The experience journey slides full-bleed panels under the rail; step aside while it runs.
          if (id === "experience") gsap.to(railRef.current, { autoAlpha: self.isActive ? 0 : 1, duration: 0.4 });
        },
      }),
    );

    return () => {
      page.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div aria-hidden>
      <span ref={barRef} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-accent xl:hidden" />
      <div ref={railRef} className="fixed bottom-8 left-6 top-24 z-40 hidden w-6 flex-col items-center xl:flex">
        <span className="relative w-px flex-1 bg-line">
          <span ref={fillRef} className="absolute inset-0 origin-top scale-y-0 bg-accent" />
        </span>
        <span className="label mt-4 flex origin-center -rotate-180 flex-col gap-3 [writing-mode:vertical-rl]">
          <span>
            offset <span ref={offsetRef} className="text-fg tabular-nums">0000</span>
          </span>
          <span ref={stageRef} className="text-accent">
            00 · Hero
          </span>
        </span>
      </div>
    </div>
  );
}
