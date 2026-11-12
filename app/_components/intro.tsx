"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../_lib/motion";

const OFFSET_END = 2048;

/**
 * ~1.2s opening: "connecting to broker…", an offset counter, then the curtain lifts onto the hero.
 * Shown once per session; skipped for reduced motion. The overlay is server-rendered so it covers
 * the first paint; an inline head script decides whether it's armed (html[data-intro]) and removes
 * it after a few seconds no matter what, so it can never trap the page.
 */
export default function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const finish = () => {
      html.removeAttribute("data-intro");
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {
        // Storage blocked: the intro just plays again next time.
      }
    };
    if (!html.hasAttribute("data-intro")) {
      window.__introDone = true;
      return;
    }

    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(counter, {
      v: OFFSET_END,
      duration: 0.75,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(4, "0");
      },
    })
      .to(barRef.current, { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, 0)
      .add(() => {
        if (statusRef.current) statusRef.current.textContent = "connected · streaming";
      })
      .to(rootRef.current, { clipPath: "inset(0 0 100% 0)", duration: 0.65, ease: "expo.inOut" }, "+=0.1")
      // The hero starts its entrance while the curtain is still lifting.
      .add(() => {
        window.__introDone = true;
        window.dispatchEvent(new Event("intro:done"));
      }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className="intro" aria-hidden>
      <div className="flex w-[min(22rem,80vw)] flex-col gap-4">
        <p className="label flex justify-between">
          <span ref={statusRef} className="text-muted">
            connecting to broker…
          </span>
          <span className="text-accent">rv.portfolio</span>
        </p>
        <span className="relative block h-px bg-line-strong">
          <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
        </span>
        <p className="flex items-baseline justify-between">
          <span className="label">offset</span>
          <span ref={countRef} className="display text-6xl tabular-nums text-fg">
            0000
          </span>
        </p>
      </div>
    </div>
  );
}
