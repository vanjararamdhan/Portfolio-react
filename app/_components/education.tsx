import { certifications, education } from "../_data/portfolio";
import { Section, vars } from "./ui";

export default function Education() {
  return (
    <Section
      id="education"
      index="06"
      eyebrow="Education"
      tone="#0d0d0c"
      title={
        <>
          Education & <em className="text-accent">certifications.</em>
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-10">
        <div aria-hidden className="hidden lg:block" />
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr] md:gap-14">
          <ul className="border-t border-line">
            {education.map((e, i) => (
              <li key={e.degree} data-reveal style={vars({ "--i": i })} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[7rem_1fr]">
                <p className="display text-5xl text-accent">{e.degree}</p>
                <div>
                  <h3 className="text-base font-medium text-fg">{e.name}</h3>
                  <p className="mt-1 text-sm text-muted">{e.institution}</p>
                  <p className="label mt-2">{e.period}</p>
                </div>
              </li>
            ))}
          </ul>

          <div data-reveal style={vars({ "--i": 2 })}>
            <h3 className="label border-b border-line pb-3">Certifications</h3>
            <ul>
              {certifications.map((c) => (
                <li key={c.name} className="border-b border-line py-4">
                  <p className="text-sm font-medium text-fg">{c.name}</p>
                  <p className="mt-0.5 text-xs text-subtle">{c.issuer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
