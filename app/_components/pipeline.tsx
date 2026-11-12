"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LuCircleCheck, LuRotateCcw } from "react-icons/lu";
import { pipelineStages } from "../_data/portfolio";
import { MQ, ScrollTrigger, gsap, scrollToTarget } from "../_lib/motion";

const STEP_MS = 520; // 6 stages ≈ 3s end to end

type RunState = "idle" | "running" | "done";

/**
 * The AndBeyond sync as an interactive pipeline. One event plays through every stage the first time it
 * scrolls into view; afterwards any stage can be selected to read what happens there.
 */
export default function Pipeline() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const scrub = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [run, setRun] = useState<RunState>("idle");
  const active = pipelineStages[activeIndex];
  const last = pipelineStages.length - 1;

  const stop = useCallback(() => {
    window.clearInterval(timer.current);
    timer.current = undefined;
  }, []);

  const play = useCallback(() => {
    stop();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveIndex(last);
      setRun("done");
      return;
    }
    let i = 0;
    setActiveIndex(0);
    setRun("running");
    timer.current = window.setInterval(() => {
      i += 1;
      if (i > last) {
        stop();
        setRun("done");
        return;
      }
      setActiveIndex(i);
    }, STEP_MS);
  }, [last, stop]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    // Desktop: the pipeline holds the screen and scrolling moves the event through each stage.
    mm.add(MQ.desktop, () => {
      let shown = -1;
      scrub.current = ScrollTrigger.create({
        trigger: el,
        start: "center center",
        end: "+=140%",
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const i = Math.min(last, Math.floor(self.progress * (last + 1)));
          if (i !== shown) {
            shown = i;
            setActiveIndex(i);
          }
          setRun(self.progress >= 0.99 ? "done" : self.progress > 0 ? "running" : "idle");
        },
      });
      return () => {
        scrub.current = null;
      };
    });

    // Elsewhere: one event plays through on its own the first time the pipeline is in view.
    mm.add(`not all and (min-width: 1024px), (prefers-reduced-motion: reduce)`, () => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          play();
        },
        { threshold: 0.5 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        stop();
      };
    });

    return () => mm.revert();
  }, [last, play, stop]);

  // Scroll-driven: jump to the stage's slice of the scroll. Otherwise manual inspection takes over.
  const select = (i: number) => {
    const st = scrub.current;
    if (st) {
      scrollToTarget(st.start + ((i + 0.5) / (last + 1)) * (st.end - st.start));
      return;
    }
    if (run === "running") {
      stop();
      setRun("done");
    }
    setActiveIndex(i);
  };

  const replay = () => {
    const st = scrub.current;
    if (st) scrollToTarget(st.start + 1);
    else play();
  };

  const progress = activeIndex / last;

  return (
    <div ref={rootRef} className="rounded-xl border border-line bg-surface/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <p className="label">
            <span className="text-accent">Pipeline</span> · AndBeyond · Zoho ⇄ master DB
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span aria-live="polite" className="label">
            {run === "running" ? (
              <span className="inline-flex items-center gap-2 text-accent">
                <span aria-hidden className="pulse-dot size-1.5 rounded-full bg-accent" />
                Event in flight
              </span>
            ) : run === "done" ? (
              <span key="done" className="swap-in inline-flex items-center gap-2 text-live">
                <LuCircleCheck aria-hidden className="size-3.5" />
                In sync
              </span>
            ) : (
              "1–2M records / day"
            )}
          </span>
          <button
            type="button"
            onClick={replay}
            className="group label inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 transition-colors hover:border-fg/50 hover:text-fg"
          >
            <LuRotateCcw aria-hidden className="size-3.5 transition-transform duration-500 group-hover:-rotate-180" />
            Replay
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <ol className="relative grid gap-1 lg:grid-cols-6 lg:gap-3">
          {/* Track: vertical on small screens, horizontal on desktop. */}
          <span aria-hidden className="absolute bottom-5 left-[15px] top-5 w-px bg-line-strong lg:inset-x-[8.33%] lg:bottom-auto lg:left-[8.33%] lg:top-[15px] lg:h-px lg:w-auto" />
          <span
            aria-hidden
            className="absolute left-[15px] top-5 hidden w-px origin-top bg-accent transition-[scale] duration-500 ease-out max-lg:block"
            style={{ height: "calc(100% - 2.5rem)", scale: `1 ${progress}` }}
          />
          <span
            aria-hidden
            className="absolute left-[8.33%] right-[8.33%] top-[15px] hidden h-px origin-left overflow-hidden bg-accent transition-[scale] duration-500 ease-out lg:block"
            style={{ scale: `${progress} 1` }}
          >
            {run === "running" && <span className="packet absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-accent-strong to-transparent" />}
          </span>

          {pipelineStages.map((stage, i) => {
            const selected = i === activeIndex;
            const passed = i <= activeIndex;
            return (
              <li key={stage.id} className="relative">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => select(i)}
                  data-cursor="Inspect"
                  onFocus={() => select(i)}
                  className={`flex w-full items-center gap-4 rounded-lg px-0 py-2 text-left transition-colors duration-200 lg:flex-col lg:items-center lg:gap-3 lg:px-2 lg:py-0 lg:text-center ${
                    selected ? "" : "hover:bg-fg/[0.03]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`relative z-10 grid size-[31px] shrink-0 place-items-center rounded-full border font-mono text-[0.68rem] transition-[background-color,border-color,color,scale] duration-300 ${
                      passed ? "border-accent bg-accent text-on-accent" : "border-line-strong bg-surface text-subtle"
                    } ${selected ? "scale-110" : ""}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-sm font-medium transition-colors ${selected ? "text-fg" : "text-muted"}`}>{stage.title}</span>
                    <span className="label mt-0.5 block">{stage.kind}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div aria-live="polite" className="mt-6 min-h-[9.5rem] border-t border-line pt-6 sm:min-h-[8rem]">
          <div key={active.id} className="swap-in grid gap-3 lg:grid-cols-[14rem_1fr] lg:gap-10">
            <p className="label">
              <span className="text-accent">Step {String(activeIndex + 1).padStart(2, "0")}</span> · {active.kind}
            </p>
            <div>
              <h3 className="display text-3xl text-fg">{active.title}</h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted">{active.detail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
