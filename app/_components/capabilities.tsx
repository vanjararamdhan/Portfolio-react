import type { IconType } from "react-icons";
import { LuCloud, LuDatabase, LuLayers, LuNetwork, LuServer, LuShieldCheck, LuSparkles, LuWebhook } from "react-icons/lu";
import { capabilities, type Capability } from "../_data/portfolio";
import { ChipList, Section, vars } from "./ui";

const icons: Record<Capability["key"], IconType> = {
  backend: LuServer,
  distributed: LuNetwork,
  api: LuWebhook,
  cloud: LuCloud,
  security: LuShieldCheck,
  data: LuDatabase,
  ai: LuSparkles,
  fullstack: LuLayers,
};

export default function Capabilities() {
  return (
    <Section
      id="expertise"
      index="02"
      eyebrow="What I do"
      title="What I build"
      intro="The backend is my home, but I own delivery end to end, including the frontend when a product needs it."
    >
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((c, i) => {
          const Icon = icons[c.key];
          return (
            <li
              key={c.key}
              data-reveal
              style={vars({ "--i": i % 4 })}
              className="spotlight group flex flex-col bg-surface p-6 transition-colors duration-300 hover:bg-surface-2"
            >
              <span className="mb-5 grid size-10 place-items-center rounded-lg border border-line bg-fg/[0.03] text-accent transition-[border-color,translate,rotate,scale,box-shadow] duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3 group-hover:scale-110 group-hover:border-accent/40 group-hover:shadow-[0_0_20px_-4px_rgb(139_92_246/0.6)]">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="text-base font-semibold text-fg">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.summary}</p>
              <ChipList items={c.tools} label={`${c.title} tools`} className="mt-auto pt-5" />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
