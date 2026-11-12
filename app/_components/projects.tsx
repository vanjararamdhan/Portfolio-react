"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LuArrowUpRight, LuX } from "react-icons/lu";
import { featuredProjects, moreProjects, type FeaturedProject, type IndexProject } from "../_data/portfolio";
import { MQ, gsap, prefersReducedMotion, smooth, useGSAP } from "../_lib/motion";
import { ChipList, Flow, Section } from "./ui";

type Entry =
  | { kind: "featured"; id: string; name: string; domain: string; meta: string; result: string; data: FeaturedProject }
  | { kind: "index"; id: string; name: string; domain: string; meta: string; result?: string; data: IndexProject };

const entries: Entry[] = [
  ...featuredProjects.map((p): Entry => ({
    kind: "featured",
    id: p.id,
    name: p.name,
    domain: [p.industry, p.location].filter(Boolean).join(" · "),
    meta: p.company,
    result: p.outcome.value,
    data: p,
  })),
  ...moreProjects.map((p): Entry => ({ kind: "index", id: p.id, name: p.name, domain: p.domain, meta: p.company, result: p.result, data: p })),
];
const byId = new Map(entries.map((e) => [e.id, e]));

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((b) => (
        <li key={b} className="grid grid-cols-[1.25rem_1fr] text-[0.95rem] leading-relaxed text-muted sm:text-base">
          <span aria-hidden className="mt-[0.75rem] h-px w-2.5 bg-accent" />
          {b}
        </li>
      ))}
    </ul>
  );
}

/** Full case study, shown in the overlay. All of them are server-rendered (hidden) for search engines. */
function CaseStudy({ entry, index }: { entry: Entry; index: number }) {
  const featured = entry.kind === "featured" ? entry.data : null;
  const item = entry.kind === "index" ? entry.data : null;
  return (
    <div className="case-body grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
      <header className="case-reveal">
        <p className="label">
          <span className="text-accent">P.{String(index + 1).padStart(2, "0")}</span> · {entry.domain}
        </p>
        <div className="mt-8 border-l-2 border-accent pl-4">
          <p className="display text-5xl text-fg">{featured ? featured.outcome.value : (item?.result ?? "—")}</p>
          <p className="mt-2 text-xs leading-snug text-subtle">{featured ? featured.outcome.label : "Result"}</p>
        </div>
        <p className="label mt-8 normal-case tracking-normal">
          {[entry.meta, featured?.role, featured?.period ?? item?.period].filter(Boolean).join(" · ")}
        </p>
      </header>

      <div className="min-w-0">
        <h3 className="case-title display text-6xl text-fg sm:text-8xl">{entry.name}</h3>
        <p className="case-reveal mt-6 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
          {featured ? (
            <>
              {featured.context}
              {featured.problem && <> {featured.problem}</>}
            </>
          ) : (
            item?.summary
          )}
        </p>

        {featured && (
          <>
            <div className="case-reveal mt-10 rounded-lg border border-line bg-surface/60 p-5">
              <p className="label mb-4">Flow · simplified</p>
              <Flow steps={featured.flow} />
            </div>
            <div className="case-reveal mt-10 grid gap-10 xl:grid-cols-[1.6fr_1fr]">
              <div>
                <p className="label mb-4">What I built</p>
                <Bullets items={featured.built} />
              </div>
              <div className="space-y-8">
                {featured.modules && (
                  <div>
                    <p className="label mb-3">Synced Zoho modules</p>
                    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-fg">
                      {featured.modules.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="label mb-3">Stack</p>
                  <ChipList items={featured.stack} label={`${entry.name} stack`} />
                </div>
              </div>
            </div>
          </>
        )}
        {item && (
          <div className="case-reveal mt-10">
            <p className="label mb-3">Stack</p>
            <ChipList items={item.stack} label={`${entry.name} stack`} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const closing = useRef(false);

  // Preview card that trails the cursor over the index (fine pointers only).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.fine, () => {
        const card = previewRef.current!;
        const list = root.current!.querySelector<HTMLElement>(".project-index")!;
        const x = gsap.quickTo(card, "x", { duration: 0.6, ease: "power3" });
        const y = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3" });
        // Beside the cursor, flipped and clamped so it never leaves the screen or slides under the header.
        const place = (e: PointerEvent, instant = false) => {
          const w = card.offsetWidth;
          const h = card.offsetHeight;
          const px = e.clientX + 32 + w > window.innerWidth - 16 ? e.clientX - w - 32 : e.clientX + 32;
          const py = gsap.utils.clamp(80, window.innerHeight - h - 16, e.clientY - h / 2);
          if (instant) gsap.set(card, { x: px, y: py });
          else {
            x(px);
            y(py);
          }
        };
        const move = (e: PointerEvent) => place(e);
        const enter = (e: PointerEvent) => {
          place(e, true);
          gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out" });
        };
        const leave = () => {
          gsap.to(card, { autoAlpha: 0, scale: 0.92, duration: 0.25 });
          setHovered(null);
        };
        gsap.set(card, { autoAlpha: 0, scale: 0.92 });
        list.addEventListener("pointermove", move);
        list.addEventListener("pointerenter", enter);
        list.addEventListener("pointerleave", leave);
        return () => {
          list.removeEventListener("pointermove", move);
          list.removeEventListener("pointerenter", enter);
          list.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  const open = useCallback((id: string, origin?: HTMLElement | null) => {
    if (!byId.has(id)) return;
    originRef.current = origin ?? document.getElementById(`project-${id}`);
    setActive(id);
  }, []);

  // Expand out of the row that was clicked, then lift the content in.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!active || !dialog || dialog.open) return;
    dialog.showModal();
    smooth.lenis?.stop();
    history.replaceState(null, "", `#project-${active}`);
    const panel = dialog.querySelector<HTMLElement>(`[data-case="${active}"]`)!;
    dialog.scrollTop = 0;
    if (prefersReducedMotion()) return;
    const r = originRef.current?.getBoundingClientRect();
    const from = r
      ? `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px)`
      : "inset(50% 0% 50% 0%)";
    gsap
      .timeline()
      .fromTo(dialog, { clipPath: from }, { clipPath: "inset(0px 0px 0px 0px)", duration: 0.85, ease: "expo.inOut" })
      .from(panel.querySelector(".case-title"), { yPercent: 40, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, "-=0.35")
      .from(panel.querySelectorAll(".case-reveal"), { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.07, ease: "power3.out" }, "<0.1");
  }, [active]);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closing.current) return;
    const done = () => {
      closing.current = false;
      dialog.close();
      gsap.set(dialog, { clearProps: "clipPath" });
      setActive(null);
      smooth.lenis?.start();
      history.replaceState(null, "", "#projects");
      originRef.current?.focus?.({ preventScroll: true });
    };
    if (prefersReducedMotion()) return done();
    closing.current = true;
    const r = originRef.current?.getBoundingClientRect();
    const to = r && r.bottom > 0 && r.top < window.innerHeight
      ? `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px)`
      : "inset(50% 0% 50% 0%)";
    gsap.to(dialog, { clipPath: to, duration: 0.65, ease: "expo.inOut", onComplete: done });
  }, []);

  // Deep links (#project-andbeyond) and project links elsewhere on the page open the overlay.
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(/^#project-(.+)$/);
      if (m && byId.has(m[1])) open(m[1]);
    };
    fromHash();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#project-"]');
      if (!a) return;
      const id = a.getAttribute("href")!.slice("#project-".length);
      if (!byId.has(id)) return;
      e.preventDefault();
      e.stopPropagation();
      open(id, a);
    };
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("click", onClick, true);
    };
  }, [open]);

  const preview = hovered ? byId.get(hovered) : null;

  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Selected work"
      tone="#0d0c0b"
      title={
        <>
          Case studies from <em className="text-accent">production.</em>
        </>
      }
      intro="Most of this is private client work, so instead of links I describe what I built and how it fits together. Open any project for the full story."
    >
      <div ref={root}>
        <ol className="project-index group/list border-t border-line">
          {entries.map((e, i) => (
            <li key={e.id} data-reveal style={{ ["--i" as string]: i % 4 }}>
              <a
                id={`project-${e.id}`}
                href={`#project-${e.id}`}
                data-cursor="Open"
                onPointerEnter={() => setHovered(e.id)}
                className="group/row grid scroll-mt-24 grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-line py-6 transition-opacity duration-500 group-hover/list:opacity-35 hover:opacity-100! sm:grid-cols-[3rem_1fr_auto] lg:grid-cols-[14rem_1fr_auto] lg:gap-x-10 lg:py-8"
              >
                <span className="label">
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="hidden lg:inline"> · {e.kind === "featured" ? "Case study" : "Project"}</span>
                </span>
                <span className="min-w-0">
                  <span className="display block text-4xl text-fg transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:translate-x-4 sm:text-6xl lg:text-7xl">
                    {e.name}
                  </span>
                  <span className="label mt-2 block normal-case tracking-normal">
                    {e.domain} · {e.meta}
                  </span>
                </span>
                <span className="flex items-center gap-3 self-center">
                  {e.result && <span className="hidden max-w-[14rem] text-right font-mono text-sm text-accent md:block">{e.result}</span>}
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-fg transition-[background-color,border-color,color,rotate] duration-500 group-hover/row:rotate-45 group-hover/row:border-accent group-hover/row:bg-accent group-hover/row:text-on-accent">
                    <LuArrowUpRight aria-hidden className="size-4" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>

        {/* Hover preview (desktop). */}
        <div
          ref={previewRef}
          aria-hidden
          className="pointer-events-none invisible fixed left-0 top-0 z-40 hidden w-80 rounded-xl border border-line-strong bg-surface/90 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl lg:block"
        >
          {preview && (
            <div key={preview.id} className="swap-in">
              <p className="label">{preview.domain}</p>
              {preview.result && <p className="display mt-3 text-4xl text-accent">{preview.result}</p>}
              {preview.kind === "featured" ? (
                <div className="mt-4">
                  <Flow steps={preview.data.flow} />
                </div>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-muted">{preview.data.summary}</p>
              )}
              <p className="label mt-4 text-fg">Click to open →</p>
            </div>
          )}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active ? `${byId.get(active)?.name} case study` : "Case study"}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        data-lenis-prevent
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-bg-2 p-0 text-fg backdrop:bg-black/60"
      >
        <div className="sticky top-0 z-10 border-b border-line bg-bg-2/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[74rem] items-center justify-between px-4 sm:px-6 lg:px-10">
            <p className="label">
              <span className="text-accent">Case study</span> · {active ? byId.get(active)?.name : ""}
            </p>
            <button
              type="button"
              onClick={close}
              data-magnetic
              className="flex h-10 items-center gap-2 rounded-full border border-line-strong pl-4 pr-3 text-fg transition-colors hover:border-fg/60"
            >
              <span className="label text-fg">Close</span>
              <LuX aria-hidden className="size-4" />
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-[74rem] px-4 pb-24 pt-12 sm:px-6 lg:px-10 lg:pt-16">
          {entries.map((e, i) => (
            <article key={e.id} data-case={e.id} hidden={active !== e.id}>
              <CaseStudy entry={e} index={i} />
            </article>
          ))}
        </div>
      </dialog>
    </Section>
  );
}
