import type { IconType } from "react-icons";
import { LuBot, LuClipboardList, LuCompass, LuGitPullRequest, LuMessagesSquare, LuTarget, LuUsers } from "react-icons/lu";
import { aiPoints, leadership } from "../_data/portfolio";
import { Section, vars } from "./ui";

const icons: IconType[] = [LuUsers, LuCompass, LuGitPullRequest, LuClipboardList, LuMessagesSquare, LuTarget];

export default function Leadership() {
  return (
    <Section
      id="leadership"
      index="07"
      eyebrow="Beyond coding"
      title="Leadership & ownership"
      intro="Seniority shows up before and after the code: in the decisions, the reviews and the conversations with clients."
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {leadership.map((item, i) => {
            const Icon = icons[i];
            return (
              <li key={item.title} data-reveal style={vars({ "--i": i % 2 + Math.floor(i / 2) })} className="spotlight group flex gap-4 bg-surface p-6 transition-colors duration-300 hover:bg-surface-2">
                <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
                <div>
                  <h3 className="font-medium text-fg">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <aside
          data-reveal
          style={vars({ "--i": 2 })}
          aria-labelledby="ai-heading"
          className="card card-hover spotlight relative overflow-hidden p-6 sm:p-8"
        >
          <div aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full bg-accent/10 blur-3xl" />
          <span className="grid size-10 place-items-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
            <LuBot aria-hidden className="size-5" />
          </span>
          <h3 id="ai-heading" className="mt-5 text-xl font-semibold tracking-tight text-fg">
            Building with AI
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            A software engineer who integrates AI capabilities into applications, and uses AI tools to ship faster.
          </p>
          <ul className="mt-6 space-y-3">
            {aiPoints.map((p) => (
              <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span aria-hidden className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-[0.72rem] text-subtle">OpenAI · Claude · LLM APIs · Claude Code · GitHub Copilot</p>
        </aside>
      </div>
    </Section>
  );
}
