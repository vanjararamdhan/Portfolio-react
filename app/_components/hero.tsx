import Image from "next/image";
import { LuArrowRight, LuDownload } from "react-icons/lu";
import { RESUME_PATH, experiences, profile } from "../_data/portfolio";
import SocialLinks from "./social-links";
import { TechIcon } from "./tech-icon";
import { ButtonLink, ChipList, Container, vars } from "./ui";

const PHOTO = "/ramdhan-vanjara.jpg";
const coreStack = ["Node.js", "TypeScript", "Express.js", "Apache Kafka", "GraphQL", "MySQL", "MongoDB", "AWS", "Kubernetes"];

function PhotoComposition() {
  return (
    <div data-tilt className="tilt relative mx-auto w-full max-w-[18rem] xl:max-w-[19.5rem]">
      <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-brand/25 blur-[90px]" />
      <div aria-hidden className="absolute -bottom-6 -right-8 -z-10 size-32 rounded-full bg-cyan/10 blur-3xl" />

      {/* Gradient ring around the portrait. */}
      <div className="rounded-[1.75rem] bg-gradient-to-br from-brand/70 via-line-strong/40 to-cyan/40 p-px shadow-2xl shadow-black/50">
        <div className="photo-reveal relative aspect-[4/5] overflow-hidden rounded-[1.7rem] bg-surface">
          <Image
            src={PHOTO}
            alt={`${profile.name}, Senior Software Engineer`}
            fill
            priority
            sizes="(min-width: 1280px) 312px, (min-width: 1024px) 288px, 0px"
            className="object-cover object-[50%_35%]"
          />
        </div>
      </div>

      <div className="glass absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 shadow-xl shadow-black/40">
        {["Node.js", "TypeScript", "Apache Kafka", "AWS"].map((t) => (
          <TechIcon key={t} name={t} brand className="size-4" />
        ))}
        <span className="ml-1 font-mono text-[0.7rem] text-muted">4+ yrs in production</span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-16">
      <div aria-hidden className="hero-glow" />
      <Container className="hero-exit grid items-center gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          {/* Below desktop the photo collapses to an avatar so the hero stays compact. */}
          <Image
            data-rise
            src={PHOTO}
            alt=""
            width={80}
            height={80}
            priority
            className="mb-6 size-20 rounded-2xl border border-brand/40 object-cover object-[50%_30%] shadow-lg shadow-brand/20 lg:hidden"
          />

          <p data-rise style={vars({ "--d": "80ms" })} className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted">
            <span className="relative flex size-2" aria-hidden>
              <span className="pulse-dot absolute inset-0 rounded-full bg-cyan" />
              <span className="relative size-2 rounded-full bg-cyan" />
            </span>
            Available for opportunities · Immediate joiner<span className="hidden sm:inline"> · {profile.location}</span>
          </p>

          <h1 id="hero-heading" className="text-5xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-7xl">
            <span className="sr-only">{profile.name}</span>
            <span aria-hidden className="flex flex-wrap gap-x-[0.25em]">
              {profile.name.split(" ").map((word, i) => (
                <span key={word} className="word-mask">
                  <span
                    className="word bg-gradient-to-br from-fg via-fg to-accent-strong bg-clip-text text-transparent"
                    style={vars({ "--d": `${180 + i * 120}ms` })}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p data-rise style={vars({ "--d": "420ms" })} className="mt-4 text-lg font-medium text-accent sm:text-xl">
            Senior Software Engineer <span className="text-subtle">— Backend / Full Stack</span>
          </p>

          <p data-rise style={vars({ "--d": "500ms" })} className="mt-6 text-xl font-medium tracking-tight text-fg sm:text-2xl">
            I build systems that scale beyond the happy path.
          </p>

          <p data-rise style={vars({ "--d": "580ms" })} className="mt-3 max-w-xl text-base leading-relaxed text-subtle sm:text-lg">
            4+ years building Node.js and TypeScript systems for international clients: microservices,
            event-driven Kafka pipelines, REST/GraphQL APIs and cloud applications across travel, insurance,
            billing, healthcare and enterprise AI.
          </p>

          <div data-rise style={vars({ "--d": "660ms" })} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="#projects" data-magnetic>
              Explore My Work
              <LuArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href={RESUME_PATH} download variant="secondary" data-magnetic>
              <LuDownload aria-hidden className="size-4 transition-transform group-hover:translate-y-0.5" />
              Download Resume
            </ButtonLink>
            <a href="#contact" className="group inline-flex min-h-11 items-center justify-center gap-1.5 px-2 text-sm font-medium text-subtle transition-colors hover:text-fg">
              <span className="u-link">Let&apos;s Connect</span>
              <LuArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          <SocialLinks className="mt-6" />

          <div data-rise style={vars({ "--d": "760ms" })} className="mt-8">
            <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">Core stack</p>
            <ChipList items={coreStack} label="Core stack" className="gap-2" />
          </div>

          <p data-rise style={vars({ "--d": "840ms" })} className="mt-8 text-xs text-subtle">
            <span className="font-mono uppercase tracking-wider">Experience at</span>{" "}
            <span className="text-muted">{experiences.map((e) => e.company).join(" · ")}</span>
          </p>
        </div>

        <div data-rise style={vars({ "--d": "200ms" })} className="hidden lg:block">
          <PhotoComposition />
        </div>
      </Container>
    </section>
  );
}
