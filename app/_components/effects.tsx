"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

const MAX_TILT = 3; // degrees

/**
 * Page-wide motion engine, wired once:
 *  - scroll reveal: IntersectionObserver marks [data-reveal] with [data-shown]; a MutationObserver
 *    picks up nodes React/HMR swaps in, so nothing can stay hidden
 *  - click ripple on .ripple-host elements
 *  - desktop only: spotlight cards, inertial hero glow, ±3° card tilt.
 *    Pointer work happens in a single rAF loop that sleeps when the cursor is still.
 */
export default function Effects() {
  useEffect(() => {
    window.__motionReady = true;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Reveal --------------------------------------------------------------
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    const observeIn = (scope: ParentNode) =>
      scope.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));
    observeIn(document);
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations)
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]:not([data-shown])")) io.observe(node);
          observeIn(node);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // --- Ripple (all pointers) -----------------------------------------------
    const onPointerDown = (e: PointerEvent) => {
      if (reduce) return;
      const host = (e.target as Element | null)?.closest<HTMLElement>(".ripple-host");
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.2;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px`;
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
      host.appendChild(ripple);
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });

    const cleanups: (() => void)[] = [];

    // --- Desktop pointer effects --------------------------------------------
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer && !reduce) {
      root.setAttribute("data-cursor", "");
      const hero = document.getElementById("home");
      const glow = hero?.querySelector<HTMLElement>(".hero-glow") ?? null;

      let mx = -100;
      let my = -100;
      let gx = 0;
      let gy = 0;
      let raf = 0;
      let tiltEl: HTMLElement | null = null;

      // Eases the hero glow toward the cursor; the loop sleeps once it has caught up.
      const tick = () => {
        if (!hero || !glow || !glow.hasAttribute("data-active")) {
          raf = 0;
          return;
        }
        const r = hero.getBoundingClientRect();
        const tx = mx - r.left;
        const ty = my - r.top;
        gx += (tx - gx) * 0.07;
        gy += (ty - gy) * 0.07;
        glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
        raf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5 ? requestAnimationFrame(tick) : 0;
      };

      const resetTilt = () => {
        if (!tiltEl) return;
        tiltEl.style.removeProperty("--rx");
        tiltEl.style.removeProperty("--ry");
        tiltEl = null;
      };

      const onMove = (e: PointerEvent) => {
        mx = e.clientX;
        my = e.clientY;
        const target = e.target as Element | null;

        const card = target?.closest<HTMLElement>(".spotlight");
        if (card) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          card.style.setProperty("--my", `${e.clientY - rect.top}px`);
        }

        const tilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;
        if (tilt !== tiltEl) resetTilt();
        if (tilt) {
          const rect = tilt.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          tilt.style.setProperty("--rx", `${(-py * MAX_TILT * 2).toFixed(2)}deg`);
          tilt.style.setProperty("--ry", `${(px * MAX_TILT * 2).toFixed(2)}deg`);
          tiltEl = tilt;
        }

        if (glow && hero) glow.toggleAttribute("data-active", hero.contains(target));
        if (!raf) raf = requestAnimationFrame(tick);
      };
      const onLeave = () => {
        glow?.removeAttribute("data-active");
        resetTilt();
      };

      document.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        document.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        root.removeAttribute("data-cursor");
      });
    }

    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("pointerdown", onPointerDown);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <div aria-hidden className="scroll-progress" />
    </>
  );
}
