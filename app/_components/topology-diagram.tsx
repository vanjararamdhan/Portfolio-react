"use client";

import { useState } from "react";

type Node = { id: string; x: number; y: number; title: string; sub: string; info: string; accent?: boolean };

const W = 110;
const H = 46;

// Conceptual system shape. Descriptions stay at the level of the stack in the resume.
const nodes: Node[] = [
  { id: "api", x: 24, y: 64, title: "API Gateway", sub: "REST · GraphQL", info: "Entry point for REST and GraphQL APIs, secured with JWT and OAuth 2.0." },
  { id: "svc", x: 165, y: 64, title: "Services", sub: "Express.js", info: "Node.js microservices holding the business logic." },
  { id: "kafka", x: 306, y: 64, title: "Apache Kafka", sub: "event log", info: "Event streaming layer: buffers record changes between systems.", accent: true },
  { id: "consumers", x: 306, y: 196, title: "Consumers", sub: "sync workers", info: "Workers that consume events and apply them to master tables." },
  { id: "db", x: 165, y: 196, title: "Master DB", sub: "MySQL · MongoDB", info: "Persistent master data, kept consistent at 1–2M records/day." },
  { id: "downstream", x: 24, y: 196, title: "Downstream", sub: "reporting", info: "Platform services and reporting read one consistent dataset." },
];

const mid = (n: Node) => ({ cx: n.x + W / 2, cy: n.y + H / 2 });
const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, Node>;

// Edges follow the request → event → storage path; each lists the nodes it joins.
const edges: { d: string; joins: [string, string] }[] = [
  { d: `M${byId.api.x + W} ${mid(byId.api).cy} H${byId.svc.x}`, joins: ["api", "svc"] },
  { d: `M${byId.svc.x + W} ${mid(byId.svc).cy} H${byId.kafka.x}`, joins: ["svc", "kafka"] },
  { d: `M${mid(byId.kafka).cx} ${byId.kafka.y + H} V${byId.consumers.y}`, joins: ["kafka", "consumers"] },
  { d: `M${byId.consumers.x} ${mid(byId.consumers).cy} H${byId.db.x + W}`, joins: ["consumers", "db"] },
  { d: `M${byId.db.x} ${mid(byId.db).cy} H${byId.downstream.x + W}`, joins: ["db", "downstream"] },
];

export default function TopologyDiagram() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = activeId ? byId[activeId] : null;

  return (
    <figure className="relative">
      <div aria-hidden className="absolute -inset-8 -z-10 rounded-[2rem] bg-accent/[0.07] blur-3xl" />
      <div className="card overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-fg/15" />
            <span className="size-2.5 rounded-full bg-fg/15" />
            <span className="size-2.5 rounded-full bg-fg/15" />
          </div>
          <span className="font-mono text-[0.7rem] text-subtle">system.topology</span>
          <span className="rounded-md border border-cyan/30 px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-cyan">
            conceptual
          </span>
        </div>

        <svg viewBox="0 0 440 290" className="block h-auto w-full" role="group" aria-label="Conceptual system topology. Focus a component to read about it.">
          <rect x="12" y="20" width="416" height="256" rx="14" fill="none" stroke="var(--color-line-strong)" strokeDasharray="3 5" />
          <text x="26" y="42" className="fill-subtle font-mono" fontSize="10" letterSpacing="1.2" aria-hidden>
            CLOUD · AWS / AZURE
          </text>

          {edges.map(({ d, joins }, i) => {
            const lit = activeId !== null && joins.includes(activeId);
            return (
              <g key={d} aria-hidden>
                <path d={d} stroke="var(--color-line-strong)" strokeWidth="1.5" fill="none" />
                <path
                  d={d}
                  stroke="var(--color-accent)"
                  strokeOpacity={lit ? 1 : activeId ? 0.25 : 0.7}
                  strokeWidth={lit ? 2.5 : 1.5}
                  fill="none"
                  className="flow-line transition-[stroke-opacity,stroke-width] duration-300"
                />
                <circle r="3" fill="var(--color-accent-strong)" className="packet">
                  <animateMotion dur={`${2 + i * 0.35}s`} repeatCount="indefinite" path={d} />
                </circle>
              </g>
            );
          })}

          {nodes.map((n) => {
            const isActive = n.id === activeId;
            const dimmed = activeId !== null && !isActive;
            return (
              <g
                key={n.id}
                tabIndex={0}
                role="button"
                aria-label={`${n.title}: ${n.info}`}
                aria-pressed={isActive}
                onMouseEnter={() => setActiveId(n.id)}
                onFocus={() => setActiveId(n.id)}
                onClick={() => setActiveId(n.id)}
                onMouseLeave={() => setActiveId(null)}
                onBlur={() => setActiveId(null)}
                className="cursor-pointer outline-none transition-opacity duration-300"
                style={{ opacity: dimmed ? 0.45 : 1 }}
              >
                <rect
                  x={n.x}
                  y={n.y}
                  width={W}
                  height={H}
                  rx="9"
                  fill={isActive || n.accent ? "rgb(139 92 246 / 0.16)" : "var(--color-surface-2)"}
                  stroke={isActive ? "var(--color-accent)" : n.accent ? "rgb(139 92 246 / 0.7)" : "var(--color-line-strong)"}
                  strokeWidth={isActive ? 2 : 1}
                  className="transition-[stroke,fill] duration-300"
                  style={isActive ? { filter: "drop-shadow(0 0 10px rgb(139 92 246 / 0.6))" } : undefined}
                />
                <text x={n.x + 12} y={n.y + 20} className="pointer-events-none fill-fg" fontSize="12.5" fontWeight="600">
                  {n.title}
                </text>
                <text x={n.x + 12} y={n.y + 35} className="pointer-events-none fill-subtle font-mono" fontSize="9.5">
                  {n.sub}
                </text>
              </g>
            );
          })}

          <text x="220" y="148" textAnchor="middle" className="fill-muted font-mono" fontSize="10" aria-hidden>
            publish → consume → apply
          </text>
        </svg>

        <figcaption
          aria-live="polite"
          className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 font-mono text-[0.7rem] text-subtle"
        >
          {active ? (
            <span key={active.id} className="swap-in text-muted">
              <span className="text-accent">{active.title}</span> — {active.info}
            </span>
          ) : (
            <>
              <span>Hover a component to inspect it</span>
              <span className="text-muted">1–2M records / day</span>
            </>
          )}
        </figcaption>
      </div>
    </figure>
  );
}
