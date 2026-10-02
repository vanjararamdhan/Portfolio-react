type Node = { id: string; x: number; y: number; title: string; sub: string; accent?: boolean };

const W = 110;
const H = 46;

const nodes: Node[] = [
  { id: "api", x: 24, y: 64, title: "API Gateway", sub: "REST · GraphQL" },
  { id: "svc", x: 165, y: 64, title: "Services", sub: "Express.js" },
  { id: "kafka", x: 306, y: 64, title: "Apache Kafka", sub: "event log", accent: true },
  { id: "consumers", x: 306, y: 196, title: "Consumers", sub: "sync workers" },
  { id: "db", x: 165, y: 196, title: "Master DB", sub: "MySQL · MongoDB" },
  { id: "downstream", x: 24, y: 196, title: "Downstream", sub: "reporting" },
];

const mid = (n: Node) => ({ cx: n.x + W / 2, cy: n.y + H / 2 });
const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, Node>;

// Edges follow the request → event → storage path.
const edges: string[] = [
  `M${byId.api.x + W} ${mid(byId.api).cy} H${byId.svc.x}`,
  `M${byId.svc.x + W} ${mid(byId.svc).cy} H${byId.kafka.x}`,
  `M${mid(byId.kafka).cx} ${byId.kafka.y + H} V${byId.consumers.y}`,
  `M${byId.consumers.x} ${mid(byId.consumers).cy} H${byId.db.x + W}`,
  `M${byId.db.x} ${mid(byId.db).cy} H${byId.downstream.x + W}`,
];

export default function TopologyDiagram() {
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

        <svg
          viewBox="0 0 440 290"
          className="block h-auto w-full"
          role="img"
          aria-labelledby="topology-diagram-title"
        >
          <title id="topology-diagram-title">
            Request and event flow: API gateway to services to Apache Kafka, consumed by sync workers into the master
            database and on to downstream services, all running in the cloud.
          </title>

          <rect x="12" y="20" width="416" height="256" rx="14" fill="none" stroke="var(--color-line-strong)" strokeDasharray="3 5" />
          <text x="26" y="42" className="fill-subtle font-mono" fontSize="10" letterSpacing="1.2">
            CLOUD · AWS / AZURE
          </text>

          {edges.map((d, i) => (
            <g key={d}>
              <path d={d} stroke="var(--color-line-strong)" strokeWidth="1.5" fill="none" />
              <path d={d} stroke="var(--color-accent)" strokeOpacity="0.7" strokeWidth="1.5" fill="none" className="flow-line" />
              <circle r="3" fill="var(--color-accent-strong)" className="packet">
                <animateMotion dur={`${2 + i * 0.35}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          ))}

          {nodes.map((n) => (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={W}
                height={H}
                rx="9"
                fill={n.accent ? "rgb(139 92 246 / 0.14)" : "var(--color-surface-2)"}
                stroke={n.accent ? "rgb(139 92 246 / 0.7)" : "var(--color-line-strong)"}
              />
              <text x={n.x + 12} y={n.y + 20} className="fill-fg" fontSize="12.5" fontWeight="600">
                {n.title}
              </text>
              <text x={n.x + 12} y={n.y + 35} className="fill-subtle font-mono" fontSize="9.5">
                {n.sub}
              </text>
            </g>
          ))}

          <text x="220" y="148" textAnchor="middle" className="fill-muted font-mono" fontSize="10">
            publish → consume → apply
          </text>
        </svg>

        <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 font-mono text-[0.7rem] text-subtle">
          <span>conceptual overview · event-driven sync</span>
          <span className="text-muted">1–2M records / day</span>
        </figcaption>
      </div>
    </figure>
  );
}
