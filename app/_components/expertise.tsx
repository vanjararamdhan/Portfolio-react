import type { IconType } from "react-icons";
import { LuCloud, LuDatabase, LuGauge, LuPlug, LuServer, LuSparkles, LuUsers } from "react-icons/lu";
import { expertise, type ExpertiseArea } from "../_data/portfolio";
import Pipeline from "./pipeline";
import { Section, vars } from "./ui";

const icons: Record<ExpertiseArea["key"], IconType> = {
  services: LuServer,
  performance: LuGauge,
  integrations: LuPlug,
  data: LuDatabase,
  cloud: LuCloud,
  leadership: LuUsers,
  ai: LuSparkles,
};

function Tile({ area, index }: { area: ExpertiseArea; index: number }) {
  const Icon = icons[area.key];
  return (
    <li data-reveal style={vars({ "--i": index % 3 })} className={area.wide ? "md:col-span-2" : ""}>
      <div
        data-tilt
        className="spotlight group flex h-full flex-col rounded-xl border border-line bg-surface/50 p-6 transition-colors duration-500 will-change-transform hover:border-accent/40 sm:p-7"
      >
      <div className="flex items-center justify-between">
        <Icon aria-hidden className="size-5 text-accent transition-transform duration-300 group-hover:-translate-y-0.5" />
        <span className="label">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="display mt-6 text-3xl text-fg">{area.title}</h3>

      {area.figures && (
        <div className={`mt-5 grid gap-4 ${area.figures.length > 1 ? "grid-cols-2" : ""}`}>
          {area.figures.map((f) => (
            <p key={f.label}>
              <span className="display block text-6xl text-accent">{f.value}</span>
              <span className="mt-1 block text-xs leading-snug text-subtle">{f.label}</span>
            </p>
          ))}
        </div>
      )}

      <p className={`mt-4 text-sm leading-relaxed text-muted ${area.wide ? "max-w-xl" : ""}`}>{area.text}</p>
      <p className="mt-auto pt-6 font-mono text-[0.7rem] leading-relaxed text-subtle">{area.tags.join("  ·  ")}</p>
      </div>
    </li>
  );
}

export default function Expertise() {
  return (
    <Section
      id="expertise"
      index="04"
      eyebrow="Engineering expertise"
      title={
        <>
          How I engineer <em className="text-accent">systems.</em>
        </>
      }
      tone="#090b0b"
      intro="The event-driven sync I built for AndBeyond. Scroll to move one record through it, stage by stage, then see the areas I work in and where I've proven them."
    >
      {/* No reveal wrapper here: a transformed ancestor would break the pinned pipeline. */}
      <Pipeline />

      <ul className="mt-12 grid gap-3 md:grid-cols-3">

        {expertise.map((area, i) => (
          <Tile key={area.key} area={area} index={i} />
        ))}
      </ul>
    </Section>
  );
}
