import { LuAward, LuGraduationCap } from "react-icons/lu";
import { certifications, education } from "../_data/portfolio";
import { Section, vars } from "./ui";

export default function Education() {
  return (
    <Section id="education" index="08" eyebrow="Education" title="Background">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ul className="grid gap-4 sm:grid-cols-2">
          {education.map((e, i) => (
            <li key={e.degree} data-reveal style={vars({ "--i": i })} className="card card-hover spotlight group p-6">
              <div className="flex items-center justify-between">
                <LuGraduationCap aria-hidden className="size-5 text-accent transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
                <span className="font-mono text-xs text-subtle">{e.period}</span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-fg">{e.degree}</h3>
              <p className="mt-1 text-sm text-muted">{e.name}</p>
              <p className="mt-4 border-t border-line pt-4 text-sm text-fg/90">{e.institution}</p>
            </li>
          ))}
        </ul>

        <div data-reveal style={vars({ "--i": 2 })} className="card card-hover p-6">
          <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-subtle">
            <LuAward aria-hidden className="size-4 text-accent" />
            Certifications & training
          </h3>
          <ul className="mt-5 space-y-4">
            {certifications.map((c) => (
              <li key={c} className="border-l border-line-strong pl-3 text-sm leading-relaxed text-fg/90">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
