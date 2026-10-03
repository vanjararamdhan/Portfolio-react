"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LuCircleCheck, LuMaximize2, LuRotateCcw, LuX } from "react-icons/lu";
import { architectureNodes, type ArchitectureNode } from "../_data/portfolio";
import TopologyDiagram from "./topology-diagram";
import { Section } from "./ui";

const STEP_MS = 420; // 7 stages ≈ 3s end to end

function Detail({ node, step, compact = false }: { node: ArchitectureNode; step: number; compact?: boolean }) {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-wider text-accent">
        Step {String(step).padStart(2, "0")} · {node.kind}
      </p>
      {!compact && <h3 className="mt-2 text-2xl font-semibold tracking-tight text-fg">{node.title}</h3>}
      <p className={`${compact ? "mt-3" : "mt-4"} leading-relaxed text-muted`}>{node.role}</p>
      <div className="mt-6 rounded-xl border border-line bg-bg/60 p-4">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-subtle">Design consideration</p>
        <p className="mt-2 text-sm leading-relaxed text-fg/90">{node.consideration}</p>
      </div>
    </>
  );
}

type RunState = "idle" | "running" | "done";

/**
 * Interactive pipeline: select a stage to inspect it. One event plays through every stage (≈3s),
 * ending on "sync complete": the first time the explorer scrolls into view ("in-view"), or as soon
 * as it mounts ("immediate", used by the fullscreen explore mode).
 */
function Explorer({ autoRun }: { autoRun: "in-view" | "immediate" }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const [run, setRun] = useState<RunState>("idle");
  const active = architectureNodes[activeIndex];

  const stop = useCallback(() => {
    window.clearInterval(timer.current);
    timer.current = undefined;
  }, []);

  const play = useCallback(() => {
    stop();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveIndex(architectureNodes.length - 1);
      setRun("done");
      return;
    }
    let i = 0;
    setActiveIndex(0);
    setRun("running");
    timer.current = window.setInterval(() => {
      i += 1;
      if (i >= architectureNodes.length) {
        stop();
        setRun("done");
        return;
      }
      setActiveIndex(i);
    }, STEP_MS);
  }, [stop]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (autoRun === "immediate") {
      const t = window.setTimeout(play, 450);
      return () => {
        window.clearTimeout(t);
        stop();
      };
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        play();
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [autoRun, play, stop]);

  // Manual inspection takes over from the autoplay.
  const select = (i: number) => {
    if (run === "running") {
      stop();
      setRun("done");
    }
    setActiveIndex(i);
  };

  const progress = activeIndex / (architectureNodes.length - 1);

  return (
    <div ref={rootRef} className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
      <div>
        <div className="mb-4 flex min-h-8 items-center justify-between gap-3" aria-live="polite">
          {run === "running" ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-accent-strong">
              <span aria-hidden className="pulse-dot size-1.5 rounded-full bg-cyan" />
              Event in flight · {active.title}
            </span>
          ) : run === "done" ? (
            <span key="done" className="swap-in inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-cyan">
              <LuCircleCheck aria-hidden className="size-3.5" />
              Sync complete
            </span>
          ) : (
            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-subtle">Event pipeline</span>
          )}
          <button
            type="button"
            onClick={play}
            className="ripple-host group inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-subtle transition-colors hover:text-fg"
          >
            <LuRotateCcw aria-hidden className="size-3.5 transition-transform duration-500 group-hover:-rotate-180" />
            Replay event
          </button>
        </div>

        <ol className="relative space-y-2">
          <span aria-hidden className="absolute bottom-6 left-6 top-6 w-px bg-line-strong" />
          <span
            aria-hidden
            className="absolute left-6 top-6 w-px origin-top bg-gradient-to-b from-brand to-cyan shadow-[0_0_10px_rgb(139_92_246/0.8)] transition-[scale] duration-[420ms] ease-out"
            style={{ height: "calc(100% - 3rem)", scale: `1 ${progress}` }}
          />
          {architectureNodes.map((node, i) => {
            const selected = i === activeIndex;
            const passed = i <= activeIndex;
            return (
              <li key={node.id} className="relative">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => select(i)}
                  onMouseEnter={() => run !== "running" && select(i)}
                  onFocus={() => select(i)}
                  className={`ripple-host flex w-full items-center gap-4 rounded-xl border px-3 py-3 text-left transition-[background-color,border-color,translate] duration-200 active:scale-[0.99] ${
                    selected ? "translate-x-1 border-accent/40 bg-accent/[0.07]" : "border-transparent hover:translate-x-0.5 hover:border-line hover:bg-fg/[0.02]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`relative grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[0.62rem] transition-[background-color,border-color,color,box-shadow,scale] duration-300 ${
                      passed ? "border-brand bg-brand text-white shadow-[0_0_12px_rgb(139_92_246/0.55)]" : "border-line-strong bg-bg text-subtle"
                    } ${selected ? "scale-110" : ""}`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[0.95rem] font-medium ${selected ? "text-fg" : "text-muted"}`}>{node.title}</span>
                    <span className="block font-mono text-[0.7rem] text-subtle">{node.kind}</span>
                  </span>
                </button>

                {/* Small screens: explanation opens inline under the selected stage. */}
                {selected && run !== "running" && (
                  <div className="swap-in mb-2 ml-10 mt-1 rounded-xl border border-line bg-surface p-5 lg:hidden">
                    <Detail node={node} step={i + 1} compact />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div aria-live="polite" className="card spotlight hidden self-start p-8 lg:sticky lg:top-24 lg:block">
        <div key={active.id} className="swap-in">
          <Detail node={active} step={activeIndex + 1} />
        </div>
        <div className="mt-8 flex gap-1" aria-hidden>
          {architectureNodes.map((n, i) => (
            <span
              key={n.id}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= activeIndex ? "bg-accent shadow-[0_0_8px_rgb(139_92_246/0.6)]" : "bg-line-strong"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Architecture() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [immersive, setImmersive] = useState(false);

  const open = () => {
    setImmersive(true);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <Section
      id="architecture"
      index="05"
      eyebrow="Architecture"
      title="How I engineer systems"
      className="immersive"
      intro={
        <>
          A simplified view of the event-driven sync I designed for <span className="text-fg">AndBeyond</span>, which
          keeps Zoho and the master database consistent in near real time. Watch one event travel the pipeline, then
          select any stage to see what it does and the trade-off behind it.
        </>
      }
    >
      <div data-reveal className="mb-10 flex justify-start">
        <button
          type="button"
          onClick={open}
          data-magnetic
          className="ripple-host group inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 px-5 text-sm font-medium text-fg transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-brand hover:bg-brand/20 hover:shadow-[0_0_24px_-6px_rgb(139_92_246/0.7)]"
        >
          <LuMaximize2 aria-hidden className="size-4 transition-transform duration-300 group-hover:scale-110" />
          Explore architecture
        </button>
      </div>

      <div data-reveal className="mx-auto mb-10 hidden max-w-2xl md:block">
        <TopologyDiagram />
      </div>
      <div data-reveal>
        <Explorer autoRun="in-view" />
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setImmersive(false)}
        aria-labelledby="architecture-dialog-title"
        className="immersive-dialog m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-bg/95 p-0 text-fg backdrop-blur-xl"
      >
        {immersive && (
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Architecture · explore mode</p>
                <h2 id="architecture-dialog-title" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  AndBeyond event-driven sync
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close explore mode"
                className="ripple-host grid size-10 shrink-0 place-items-center rounded-xl border border-line text-subtle transition-colors hover:border-brand/50 hover:text-fg"
              >
                <LuX aria-hidden className="size-5" />
              </button>
            </div>
            <div className="mx-auto mb-10 max-w-2xl">
              <TopologyDiagram />
            </div>
            <Explorer autoRun="immediate" />
          </div>
        )}
      </dialog>
    </Section>
  );
}
