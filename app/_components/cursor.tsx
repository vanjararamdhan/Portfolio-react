"use client";

import { useEffect, useRef } from "react";
import { MQ, emitBurst, gsap, stream } from "../_lib/motion";

const MAGNET = 0.28; // share of the pointer offset a magnetic element follows
const TILT = 6; // max degrees

/**
 * Pointer layer for fine pointers (desktop), wired once:
 *  - custom cursor: a dot plus a ring that grows over interactive elements and shows the action
 *    named by the nearest [data-cursor] ("Open", "Download", …)
 *  - magnetic pull on [data-magnetic], 3D tilt on [data-tilt], pointer light on .spotlight
 *  - pointer position and click bursts for the WebGL stream
 * Touch devices and reduced-motion visitors keep the native cursor and none of this runs.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.fine, () => {
      const dot = dotRef.current!;
      const ring = ringRef.current!;
      const label = labelRef.current!;
      const root = document.documentElement;
      root.classList.add("has-cursor");

      const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

      let magnet: HTMLElement | null = null;
      let tilt: HTMLElement | null = null;
      let mode = "";

      const setMode = (next: string, text = "") => {
        if (next === mode && label.textContent === text) return;
        mode = next;
        label.textContent = text;
        const size = next === "label" ? 84 : next === "hover" ? 52 : 32;
        gsap.to(ring, {
          width: size,
          height: size,
          backgroundColor: next === "label" ? "rgb(242 164 58 / 1)" : "rgb(242 164 58 / 0)",
          borderColor: next === "idle" ? "rgb(243 242 237 / 0.35)" : "rgb(242 164 58 / 0.9)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { autoAlpha: next === "label" ? 1 : 0, duration: 0.2 });
        gsap.to(dot, { scale: next === "idle" ? 1 : 0, duration: 0.2 });
      };
      setMode("idle");

      const release = (el: HTMLElement | null, props: gsap.TweenVars) => {
        if (el) gsap.to(el, { ...props, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      };

      // What the cursor shows depends on what's under it.
      const readTarget = (target: Element | null) => {
        const labelled = target?.closest<HTMLElement>("[data-cursor]");
        const interactive = target?.closest("a, button, summary, [role='button'], label");
        if (labelled) setMode("label", labelled.dataset.cursor);
        else if (interactive) setMode("hover");
        else setMode("idle");
      };
      // Content scrolls under a still cursor, so re-read the element beneath it on scroll.
      const last = { x: -1, y: -1 };
      let scrollRaf = 0;
      const onScroll = () => {
        if (scrollRaf || last.x < 0) return;
        scrollRaf = requestAnimationFrame(() => {
          scrollRaf = 0;
          readTarget(document.elementFromPoint(last.x, last.y));
        });
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const { clientX: x, clientY: y } = e;
        dotX(x);
        dotY(y);
        ringX(x);
        ringY(y);
        stream.pointer.x = (x / window.innerWidth) * 2 - 1;
        stream.pointer.y = -((y / window.innerHeight) * 2 - 1);
        stream.pointer.active = true;

        last.x = x;
        last.y = y;
        const target = e.target as Element | null;
        readTarget(target);

        const nextMagnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
        if (nextMagnet !== magnet) {
          release(magnet, { x: 0, y: 0 });
          magnet = nextMagnet;
        }
        if (magnet) {
          const r = magnet.getBoundingClientRect();
          gsap.to(magnet, { x: (x - (r.left + r.width / 2)) * MAGNET, y: (y - (r.top + r.height / 2)) * MAGNET, duration: 0.4, ease: "power3.out" });
        }

        const nextTilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;
        if (nextTilt !== tilt) {
          release(tilt, { rotateX: 0, rotateY: 0 });
          tilt = nextTilt;
        }
        if (tilt) {
          const r = tilt.getBoundingClientRect();
          const px = (x - r.left) / r.width - 0.5;
          const py = (y - r.top) / r.height - 0.5;
          gsap.to(tilt, { rotateY: px * TILT * 2, rotateX: -py * TILT * 2, transformPerspective: 900, duration: 0.5, ease: "power3.out" });
        }

        const spot = target?.closest<HTMLElement>(".spotlight");
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty("--mx", `${x - r.left}px`);
          spot.style.setProperty("--my", `${y - r.top}px`);
        }
      };

      const onLeave = () => {
        stream.pointer.active = false;
        gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
        release(magnet, { x: 0, y: 0 });
        release(tilt, { rotateX: 0, rotateY: 0 });
        magnet = tilt = null;
      };
      const onEnter = () => gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 });
      const onDown = (e: PointerEvent) => {
        gsap.fromTo(ring, { scale: 1 }, { scale: 0.82, duration: 0.12, yoyo: true, repeat: 1 });
        // Clicking open space sends a pulse through the stream.
        if (!(e.target as Element | null)?.closest("a, button, input, textarea, dialog, [data-cursor]")) emitBurst(e.clientX, e.clientY);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("pointerenter", onEnter);
      return () => {
        cancelAnimationFrame(scrollRaf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        root.removeEventListener("pointerleave", onLeave);
        root.removeEventListener("pointerenter", onEnter);
        root.classList.remove("has-cursor");
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
