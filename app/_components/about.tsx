import { metrics, secondaryMetrics, type Metric } from "../_data/portfolio";
import Counter from "./counter";
import { Section, vars } from "./ui";

const facts = [
  { label: "Clients in", value: "South Africa · Israel · Poland" },
  { label: "Domains", value: "Travel · Insurance · Billing & subscriptions · Healthcare · Enterprise AI" },
  { label: "Based in", value: "Pune, India · immediate joiner" },
];

function MetricValue({ metric }: { metric: Metric }) {
  return metric.display ?? <Counter value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />;
}

export default function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title={
        <>
          Backend engineer for systems where{" "}
          <span className="text-muted">data has to be right.</span>
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div data-reveal className="space-y-5 text-base leading-relaxed text-muted sm:text-[1.05rem]">
          <p>
            I&apos;m a Senior Software Engineer with <strong className="font-medium text-fg">4+ years</strong> of
            backend and full-stack work in <strong className="font-medium text-fg">Node.js and TypeScript</strong>. I
            design microservices, event-driven pipelines and the REST and GraphQL APIs that other teams build on,
            and I run them in production on AWS and Azure.
          </p>
          <p>
            Most of that work has been for international clients, where I&apos;ve owned the path from a client&apos;s
            requirement to a deployed, tested system. I also led a{" "}
            <strong className="font-medium text-fg">10-member backend team</strong> for 2.5 years, owning
            architecture decisions and code reviews.
          </p>

          <dl className="mt-8 divide-y divide-line border-y border-line">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-1 py-3.5 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-subtle sm:pt-0.5">{f.label}</dt>
                <dd className="text-sm text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {metrics.map((m, i) => (
              <li key={m.label} data-reveal style={vars({ "--i": i })} className="spotlight bg-surface p-5 transition-colors duration-300 hover:bg-surface-2 sm:p-7">
                <p className="bg-gradient-to-br from-fg to-accent-strong bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
                  <MetricValue metric={m} />
                </p>
                <p className="mt-2 text-sm leading-snug text-muted">{m.label}</p>
              </li>
            ))}
          </ul>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
            {secondaryMetrics.map((m, i) => (
              <li key={m.label} data-reveal style={vars({ "--i": i + 2 })} className="border-l border-line-strong pl-3 transition-colors duration-300 hover:border-brand">
                <p className="font-mono text-lg text-accent">
                  <MetricValue metric={m} />
                </p>
                <p className="mt-1 text-xs leading-snug text-subtle">{m.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
