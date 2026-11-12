"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { coreSkills, experiences, featuredProjects, moreProjects, skillGroups } from "../_data/portfolio";
import { MQ, gsap, useGSAP } from "../_lib/motion";
import { TechIcon } from "./tech-icon";
import { Section, vars } from "./ui";

// Stack names that refer to the same skill as the skills list.
const ALIAS: Record<string, string> = { AWS: "AWS (S3, Lambda, IAM)" };

// Every place a skill was used, straight from the resume data: projects and roles.
const usages = [
  ...featuredProjects.map((p) => ({ name: p.name, stack: p.stack })),
  ...moreProjects.map((p) => ({ name: p.name, stack: p.stack })),
  ...experiences.map((e) => ({ name: e.company.replace(" Pvt. Ltd.", ""), stack: e.stack })),
];

const C = 500; // viewBox centre
const R = 300; // node ring radius
const GAP = 1.6; // empty slots between categories

type Node = { name: string; category: string; cat: number; angle: number; x: number; y: number };

function buildGraph() {
  const all = skillGroups.flatMap((g, cat) => g.items.map((name) => ({ name, category: g.category, cat })));
  const slots = all.length + GAP * skillGroups.length;
  let slot = 0;
  let prevCat = -1;
  const nodes: Node[] = all.map((s) => {
    if (s.cat !== prevCat) {
      slot += prevCat === -1 ? GAP / 2 : GAP;
      prevCat = s.cat;
    }
    const angle = (slot / slots) * Math.PI * 2 - Math.PI / 2;
    slot += 1;
    return { ...s, angle, x: C + Math.cos(angle) * R, y: C + Math.sin(angle) * R };
  });
  const index = new Map(nodes.map((n, i) => [n.name, i]));

  const usedIn = new Map<string, string[]>();
  const edges = new Map<string, { a: number; b: number; w: number }>();
  for (const u of usages) {
    const ids = [...new Set(u.stack.map((s) => index.get(ALIAS[s] ?? s)).filter((i): i is number => i !== undefined))];
    ids.forEach((i) => usedIn.set(nodes[i].name, [...(usedIn.get(nodes[i].name) ?? []), u.name]));
    for (let x = 0; x < ids.length; x++)
      for (let y = x + 1; y < ids.length; y++) {
        const [a, b] = ids[x] < ids[y] ? [ids[x], ids[y]] : [ids[y], ids[x]];
        const key = `${a}-${b}`;
        const e = edges.get(key);
        if (e) e.w += 1;
        else edges.set(key, { a, b, w: 1 });
      }
  }
  return { nodes, edges: [...edges.values()], usedIn };
}

// The graph only depends on resume data, so it is built once.
const { nodes, edges, usedIn } = buildGraph();

/** Bundled curve between two ring nodes, bent toward the centre. */
const curve = (a: Node, b: Node) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const cx = C + (mx - C) * 0.18;
  const cy = C + (my - C) * 0.18;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

function SkillMap() {
  const [active, setActive] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const linked = useMemo(() => {
    if (active === null) return null;
    const set = new Set<number>([active]);
    edges.forEach((e) => {
      if (e.a === active) set.add(e.b);
      if (e.b === active) set.add(e.a);
    });
    return set;
  }, [active]);

  // Edges draw themselves in and the ring of skills grows in when the map scrolls into view (desktop,
  // where the map is shown). Only SVG attributes are tweened: CSS transforms on ~250 SVG elements
  // would force a style recalculation per element at page load.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: svgRef.current, start: "top 75%", once: true } });
        tl.from(".map-node", { attr: { r: 0 }, duration: 0.5, stagger: 0.012, ease: "back.out(2)" })
          .fromTo(".map-label", { attr: { opacity: 0 } }, { attr: { opacity: 1 }, duration: 0.6, stagger: 0.01 }, 0.2)
          .fromTo(".map-edge", { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.4, stagger: 0.004, ease: "power2.inOut" }, 0.3);
      });
    },
    { scope: svgRef },
  );

  const current = active !== null ? nodes[active] : null;
  const where = current ? (usedIn.get(current.name) ?? []) : [];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_18rem]">
      <svg ref={svgRef} viewBox="0 0 1000 1000" className="mx-auto block w-full max-w-[46rem]" role="group" aria-label="Skills map: each skill around the ring, linked to the skills it was used with on the same project or role.">
        <circle cx={C} cy={C} r={R - 22} fill="none" stroke="var(--color-line)" strokeDasharray="2 6" />
        <g fill="none">
          {edges.map((e) => {
            const on = linked ? e.a === active || e.b === active : false;
            return (
              <path
                key={`${e.a}-${e.b}`}
                d={curve(nodes[e.a], nodes[e.b])}
                pathLength={1}
                strokeDasharray="1 1"
                className="map-edge transition-[stroke,stroke-opacity] duration-300"
                stroke={on ? "var(--color-accent)" : "var(--color-fg)"}
                strokeOpacity={linked ? (on ? 0.9 : 0.03) : 0.06 + Math.min(e.w, 4) * 0.025}
                strokeWidth={on ? 1.6 : 1}
              />
            );
          })}
        </g>
        {nodes.map((n, i) => {
          const deg = (n.angle * 180) / Math.PI;
          const flip = Math.cos(n.angle) < 0;
          const lit = linked ? linked.has(i) : true;
          const core = coreSkills.has(n.name);
          return (
            <g
              key={n.name}
              tabIndex={0}
              role="button"
              aria-label={`${n.name}, ${n.category}${usedIn.get(n.name) ? `. Used in ${usedIn.get(n.name)!.join(", ")}` : ""}`}
              aria-pressed={active === i}
              data-cursor="Trace"
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="cursor-pointer outline-none"
              style={{ opacity: lit ? 1 : 0.25, transition: "opacity 300ms" }}
            >
              <circle className="map-node" cx={n.x} cy={n.y} r={active === i ? 7 : core ? 5 : 3.5} fill={core || active === i ? "var(--color-accent)" : "var(--color-muted)"} />
              <text
                className="map-label font-sans"
                transform={`translate(${n.x} ${n.y}) rotate(${flip ? deg + 180 : deg})`}
                x={flip ? -14 : 14}
                dy="0.35em"
                textAnchor={flip ? "end" : "start"}
                fontSize={active === i ? 15 : 13}
                fill={active === i ? "var(--color-accent-strong)" : core ? "var(--color-fg)" : "var(--color-subtle)"}
              >
                {n.name}
              </text>
            </g>
          );
        })}
        <text x={C} y={C - 8} textAnchor="middle" className="display" fontSize={current ? 40 : 44} fill="var(--color-fg)">
          {current ? current.name : `${nodes.length} skills`}
        </text>
        <text x={C} y={C + 28} textAnchor="middle" className="font-mono uppercase" fontSize="12" letterSpacing="1.5" fill="var(--color-accent)">
          {current ? current.category : `${skillGroups.length} layers · hover to trace`}
        </text>
      </svg>

      <aside aria-live="polite" className="min-h-[16rem] border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        {current ? (
          <div key={current.name} className="swap-in">
            <p className="label text-accent">{current.category}</p>
            <p className="display mt-3 text-4xl text-fg">{current.name}</p>
            <p className="label mt-6">{where.length ? "Used in" : "In my toolkit"}</p>
            {where.length ? (
              <ul className="mt-3 space-y-1.5 text-sm text-fg">
                {where.map((w) => (
                  <li key={w} className="flex items-center gap-2">
                    <span aria-hidden className="h-px w-3 bg-accent" />
                    {w}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-muted">Part of my day-to-day toolkit across roles.</p>
            )}
          </div>
        ) : (
          <div>
            <p className="label">How to read it</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Every skill on my resume sits on the ring, grouped by layer. Lines connect skills I used together on the same project
              or role; thicker bundles mean more shared work. Hover or focus a skill to trace it.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-fg">
              <span aria-hidden className="size-2.5 rounded-full bg-accent" /> Core, day-to-day expertise
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

/**
 * The map is ~300 SVG elements that only desktop shows, so it mounts as it approaches the screen
 * (behind a placeholder of the same size, so nothing below it moves) instead of at page load.
 */
function LazySkillMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    let io: IntersectionObserver | null = null;
    const watch = () => {
      if (!desktop.matches || io || !ref.current) return;
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io?.disconnect();
          setReady(true);
        },
        { rootMargin: "100% 0px" },
      );
      io.observe(ref.current);
    };
    watch();
    desktop.addEventListener("change", watch);
    return () => {
      desktop.removeEventListener("change", watch);
      io?.disconnect();
    };
  }, []);

  if (ready) return <SkillMap />;
  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-[1fr_18rem]">
      <div className="mx-auto aspect-square w-full max-w-[46rem]" />
    </div>
  );
}

export default function Skills() {
  return (
    <Section
      id="skills"
      index="05"
      eyebrow="Technical skills"
      tone="#0c0b0d"
      title={
        <>
          The stack, <em className="text-accent">connected.</em>
        </>
      }
      intro="Not a list of logos: the tools I've used in production, wired together by the projects that used them."
    >
      <div className="hidden lg:block">
        <LazySkillMap />
      </div>

      {/* Phones and tablets (and search engines): the same skills as a list by layer. */}
      <dl className="border-t border-line lg:sr-only">
        {skillGroups.map((group, i) => (
          <div
            key={group.category}
            data-reveal
            style={vars({ "--i": i % 4 })}
            className="grid gap-3 border-b border-line py-5 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6"
          >
            <dt className="label">{group.category}</dt>
            <dd>
              <ul className="pop flex flex-wrap gap-2">
                {group.items.map((item, j) => {
                  const core = coreSkills.has(item);
                  return (
                    <li
                      key={item}
                      style={vars({ "--j": j })}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                        core ? "border-accent/50 bg-accent/10 text-fg" : "border-line text-muted"
                      }`}
                    >
                      <TechIcon name={item} brand className="size-4" />
                      {item}
                      {core && <span className="sr-only"> (core)</span>}
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
