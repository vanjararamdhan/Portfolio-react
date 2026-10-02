"use client";

import { useState } from "react";
import { architectureNodes, type ArchitectureNode } from "../_data/portfolio";
import TopologyDiagram from "./topology-diagram";
import { Section } from "./ui";

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

export default function Architecture() {
  const [activeId, setActiveId] = useState(architectureNodes[0].id);
  const activeIndex = architectureNodes.findIndex((n) => n.id === activeId);
  const active = architectureNodes[activeIndex];

  return (
    <Section
      id="architecture"
      index="05"
      eyebrow="Architecture"
      title="How I engineer systems"
      intro={
        <>
          A simplified view of the event-driven sync I designed for <span className="text-fg">AndBeyond</span>, which
          keeps Zoho and the master database consistent in near real time. Select a stage to see what it does and the
          trade-off behind it.
        </>
      }
    >
      <div data-reveal className="mx-auto mb-10 hidden max-w-2xl md:block">
        <TopologyDiagram />
      </div>
      <div data-reveal className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
        <ol className="relative space-y-2">
          <span aria-hidden className="absolute bottom-6 left-6 top-6 w-px bg-line-strong" />
          {architectureNodes.map((node, i) => {
            const selected = node.id === activeId;
            const passed = i <= activeIndex;
            return (
              <li key={node.id} className="relative">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveId(node.id)}
                  onMouseEnter={() => setActiveId(node.id)}
                  onFocus={() => setActiveId(node.id)}
                  className={`ripple-host flex w-full items-center gap-4 rounded-xl border px-3 py-3 text-left transition-[background-color,border-color,translate] duration-200 active:scale-[0.99] ${
                    selected ? "translate-x-1 border-accent/40 bg-accent/[0.07]" : "border-transparent hover:translate-x-0.5 hover:border-line hover:bg-fg/[0.02]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`relative grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[0.62rem] transition-[background-color,border-color,color,box-shadow,scale] duration-300 ${
                      passed ? "border-brand bg-brand text-white shadow-[0_0_12px_rgb(139_92_246/0.55)]" : "border-line-strong bg-bg text-subtle"
                    } ${selected ? "scale-110" : ""
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[0.95rem] font-medium ${selected ? "text-fg" : "text-muted"}`}>{node.title}</span>
                    <span className="block font-mono text-[0.7rem] text-subtle">{node.kind}</span>
                  </span>
                </button>

                {/* Small screens: explanation opens inline under the selected stage. */}
                {selected && (
                  <div className="swap-in mb-2 ml-10 mt-1 rounded-xl border border-line bg-surface p-5 lg:hidden">
                    <Detail node={node} step={i + 1} compact />
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div
          aria-live="polite"
          className="card spotlight hidden self-start p-8 lg:sticky lg:top-24 lg:block"
        >
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
    </Section>
  );
}
