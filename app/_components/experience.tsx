import { LuArrowUpRight } from "react-icons/lu";
import { experiences } from "../_data/portfolio";
import { ChipList, Section, vars } from "./ui";

export default function Experience() {
  return (
    <Section
      id="experience"
      index="03"
      eyebrow="Experience"
      title="Where I've shipped production systems"
      intro="From enterprise scale at Publicis to leading a backend team and owning international client delivery."
    >
      <ol className="tl relative">
        <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line md:left-[calc(11rem+7px)]" />
        <span aria-hidden className="tl-line absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-brand via-accent/70 to-transparent shadow-[0_0_8px_rgb(139_92_246/0.6)] md:left-[calc(11rem+7px)]" />
        {experiences.map((job) => (
          <li key={job.company} data-reveal="left" className="relative grid gap-4 pb-10 pl-9 last:pb-0 md:grid-cols-[11rem_1fr] md:gap-10 md:pl-0">
            <span
              aria-hidden
              className="tl-dot absolute left-0 top-1.5 z-10 size-[15px] rounded-full border-2 bg-bg md:left-[11rem]"
            />
            <div className="md:pr-6 md:text-right">
              <p className="font-mono text-xs text-accent">{job.period}</p>
              <p className="mt-1 text-xs text-subtle">{job.location}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-tight text-fg">
                {job.role}
                <span className="text-muted"> · {job.company}</span>
              </h3>
              <p className="mt-2 text-sm italic text-subtle">{job.context}</p>

              <ul className="mt-5 space-y-3">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted">
                    <span aria-hidden className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>

              {job.subProjects && (
                <div className="mt-6">
                  <p className="mb-3 font-mono text-xs uppercase tracking-wider text-subtle">Selected client projects</p>
                  <ul className="grid gap-3 sm:grid-cols-3">
                    {job.subProjects.map((p, j) => (
                      <li key={p.name} data-reveal style={vars({ "--i": j })}>
                        <a
                          href={`#project-${p.projectId}`}
                          className="ripple-host card card-hover spotlight group block h-full p-4"
                        >
                          <span className="flex items-center justify-between text-sm font-medium text-fg">
                            {p.name}
                            <LuArrowUpRight aria-hidden className="size-4 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                          </span>
                          <span className="mt-1 block text-xs text-muted">{p.summary}</span>
                          <span className="mt-2 block font-mono text-[0.7rem] text-subtle">{p.period}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ChipList items={job.stack} label={`${job.company} stack`} className="mt-6" />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
