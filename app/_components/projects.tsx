import { LuPlus } from "react-icons/lu";
import { featuredProjects, secondaryProjects, type FeaturedProject } from "../_data/portfolio";
import { ChipList, Flow, Section, vars } from "./ui";

function CaseStudy({ project, lead, index }: { project: FeaturedProject; lead: boolean; index: number }) {
  return (
    <article
      id={`project-${project.id}`}
      data-reveal
      data-tilt
      style={vars({ "--i": lead ? 0 : index - 1 })}
      className={`card card-hover tilt spotlight group relative scroll-mt-24 overflow-hidden p-6 sm:p-8 ${lead ? "lg:col-span-2" : ""}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            <span className="text-subtle">{String(index).padStart(2, "0")} / </span>
            {project.industry}
            {project.location && <span className="text-subtle"> · {project.location}</span>}
          </p>
          <h3 className={`mt-2 font-semibold tracking-tight text-fg ${lead ? "text-3xl" : "text-2xl"}`}>{project.name}</h3>
          <p className="mt-1 text-sm text-subtle">
            {project.role} · {project.company}
          </p>
        </div>
        <div className="rounded-xl border border-accent/25 bg-accent/[0.06] px-4 py-3 transition-[border-color,box-shadow] duration-300 group-hover:border-accent/50 group-hover:shadow-[0_0_24px_-6px_rgb(139_92_246/0.6)] sm:max-w-[16rem]">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">Outcome</p>
          <p className="text-lg font-semibold text-accent-strong">{project.achievement.value}</p>
          <p className="mt-0.5 text-xs leading-snug text-muted">{project.achievement.label}</p>
        </div>
      </header>

      <div className={`mt-8 grid gap-8 ${lead ? "lg:grid-cols-[1fr_1.15fr]" : ""}`}>
        <div className="space-y-6">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-subtle">Context</h4>
            <p className="mt-2 leading-relaxed text-muted">{project.context}</p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-subtle">Problem</h4>
            <p className="mt-2 leading-relaxed text-muted">{project.problem}</p>
          </div>
          <div>
            <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-subtle">
              {project.modules ? "Architecture" : "Flow"} <span className="normal-case tracking-normal text-disabled">· simplified</span>
            </h4>
            <Flow steps={project.flow} />
          </div>
          {project.modules && (
            <div>
              <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-subtle">Synced Zoho modules</h4>
              <ChipList items={project.modules} />
            </div>
          )}
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-wider text-subtle">My role</h4>
          <ul className="mt-3 space-y-3">
            {project.built.map((b) => (
              <li key={b} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted">
                <span aria-hidden className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-accent" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ChipList items={project.stack} label={`${project.name} stack`} nudge className="mt-8 border-t border-line pt-6" />
    </article>
  );
}

export default function Projects() {
  return (
    <Section
      id="projects"
      index="04"
      eyebrow="Selected work"
      title="Engineering case studies"
      intro="Production platforms I've built for clients. Some are private client work, so I describe the engineering here instead of linking to it."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <CaseStudy key={p.id} project={p} lead={i === 0} index={i + 1} />
        ))}
      </div>

      <h3 className="mb-5 mt-12 font-mono text-xs uppercase tracking-wider text-subtle">More projects</h3>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {secondaryProjects.map((p, i) => (
          <li key={p.id} id={`project-${p.id}`} data-reveal style={vars({ "--i": i })} className="scroll-mt-24">
            <details className="ripple-host card card-hover spotlight group h-full p-5 open:border-brand/30">
              <summary className="flex cursor-pointer list-none flex-col gap-3 [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider text-accent">{p.industry}</span>
                  <LuPlus
                    aria-hidden
                    className="size-4 shrink-0 text-subtle transition-transform duration-300 group-open:rotate-45 group-hover:text-fg"
                  />
                </span>
                <span className="text-lg font-semibold text-fg">{p.name}</span>
                <span className="text-sm leading-relaxed text-muted">{p.summary}</span>
                {p.badge && (
                  <span className="font-mono text-sm text-accent-strong">
                    {p.badge.value} <span className="text-subtle">{p.badge.label}</span>
                  </span>
                )}
                <span className="text-xs text-subtle">
                  {p.role} · {p.company}
                  {p.location && ` · ${p.location}`}
                </span>
              </summary>
              <ul className="swap-in mt-4 space-y-2 border-t border-line pt-4">
                {p.details.map((d) => (
                  <li key={d} className="text-sm leading-relaxed text-muted">
                    {d}
                  </li>
                ))}
              </ul>
              <ChipList items={p.stack} className="swap-in mt-4" />
            </details>
          </li>
        ))}
      </ul>
    </Section>
  );
}
