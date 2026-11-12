"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** The page's Lenis instance, when smooth scrolling is active (desktop, motion allowed). */
export const smooth: { lenis: Lenis | null } = { lenis: null };

/** Scrolls to an element or y offset, through Lenis when it's active. */
export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  if (smooth.lenis) {
    smooth.lenis.scrollTo(target, { offset });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : typeof target === "number" ? null : target;
  const top = el ? el.getBoundingClientRect().top + window.scrollY + offset : (target as number);
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/** Media queries shared by every scene, for gsap.matchMedia(). */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktop: "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
  fine: "(prefers-reduced-motion: no-preference) and (pointer: fine)",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Shared state between the DOM scenes and the WebGL stream. Scenes write, the render loop reads,
 * so nothing here triggers React renders.
 *  - formation: 0 = hero partitions, 1 = ambient drift, 2 = contact convergence (fractional = morphing)
 *  - intensity: overall particle brightness (dimmed behind dense content)
 *  - pointer: viewport-normalised (-1..1), y up
 *  - bursts: click pulses, consumed by the stream
 */
export const stream = {
  formation: 0,
  intensity: 1,
  pointer: { x: 0, y: 0, active: false },
  bursts: [] as { x: number; y: number; t: number }[],
};

/** Fires a particle pulse from a viewport point (client px). */
export function emitBurst(clientX: number, clientY: number) {
  if (typeof window === "undefined") return;
  stream.bursts.push({
    x: (clientX / window.innerWidth) * 2 - 1,
    y: -((clientY / window.innerHeight) * 2 - 1),
    t: performance.now(),
  });
  if (stream.bursts.length > 4) stream.bursts.shift();
}

/** Resolves once the opening intro has finished (immediately if it was skipped). */
export function whenIntroDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if (window.__introDone || !document.documentElement.hasAttribute("data-intro")) {
    cb();
    return () => {};
  }
  window.addEventListener("intro:done", cb, { once: true });
  return () => window.removeEventListener("intro:done", cb);
}

declare global {
  interface Window {
    __introDone?: boolean;
    __motionReady?: boolean;
  }
}
