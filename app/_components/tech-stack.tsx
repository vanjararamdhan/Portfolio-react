import { coreSkills, skillGroups } from "../_data/portfolio";
import { TechIcon } from "./tech-icon";
import { Section, vars } from "./ui";

export default function TechStack() {
  return (
    <Section
      id="skills"
      index="06"
      eyebrow="Tech stack"
      title="Tools I use in production"
      intro={
        <>
          Grouped by where they sit in a system.{" "}
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-fg">
            <span aria-hidden className="size-2 rounded-full bg-accent" /> Highlighted
          </span>{" "}
          = core, day-to-day expertise.
        </>
      }
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <div
            key={group.category}
            data-reveal
            style={vars({ "--i": i % 3 })}
            className="spotlight group bg-surface p-6 transition-colors duration-300 hover:bg-surface-2"
          >
            <h3 className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-subtle transition-colors group-hover:text-muted">
              {group.category}
              <span aria-hidden className="text-subtle/70">{String(group.items.length).padStart(2, "0")}</span>
            </h3>
            <ul className="pop mt-4 flex flex-wrap gap-2">
              {group.items.map((item, j) => {
                const core = coreSkills.has(item);
                return (
                  <li
                    key={item}
                    style={vars({ "--j": j })}
                    className={`group/chip inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition-[border-color,color,translate,scale,box-shadow] duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_6px_18px_-8px_rgb(139_92_246/0.7)] ${
                      core
                        ? "border-accent/40 bg-accent/10 text-accent-strong"
                        : "border-line bg-fg/[0.02] text-muted hover:border-brand/50 hover:text-fg"
                    }`}
                  >
                    <TechIcon name={item} brand className="size-4 transition-transform duration-200 group-hover/chip:-rotate-6 group-hover/chip:scale-110" />
                    {item}
                    {core && <span className="sr-only"> (core)</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
