"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, whenIntroDone } from "../_lib/motion";

/** Whether this device should run the WebGL stream at all, and how many particles it gets. */
function streamBudget(): number {
  if (prefersReducedMotion()) return 0;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return 0;
  if ((nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2) return 0;
  const probe = document.createElement("canvas");
  if (!probe.getContext("webgl2") && !probe.getContext("webgl")) return 0;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  return coarse || small ? 2200 : (nav.hardwareConcurrency ?? 8) <= 4 ? 4000 : 7000;
}

/**
 * Fixed full-screen canvas behind the page. three.js is fetched only after the page is idle, and
 * only on capable devices; everyone else keeps the static glow underneath.
 */
export default function StreamField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const count = streamBudget();
    if (!count) return;
    let disposed = false;
    let dispose: (() => void) | undefined;

    const boot = () =>
      import("./stream-scene").then(({ createStreamScene }) => {
        if (disposed || !canvasRef.current) return;
        dispose = createStreamScene(canvasRef.current, { count, onFirstFrame: () => setLive(true) }).dispose;
      });
    // Boot after the intro (the curtain hides the hero anyway) and once the main thread is idle, so
    // fetching and compiling three.js never competes with hydration or the entrance animation.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    let handle: number | undefined;
    const unlisten = whenIntroDone(() => {
      handle = idle(() => void boot(), { timeout: 2500 });
    });

    return () => {
      disposed = true;
      unlisten();
      if (window.cancelIdleCallback && handle !== undefined) window.cancelIdleCallback(handle);
      dispose?.();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="stream-glow" />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-[1500ms] ${live ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
