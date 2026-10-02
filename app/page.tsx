import About from "./_components/about";
import Architecture from "./_components/architecture";
import Capabilities from "./_components/capabilities";
import Contact from "./_components/contact";
import Education from "./_components/education";
import Experience from "./_components/experience";
import Hero from "./_components/hero";
import Leadership from "./_components/leadership";
import Projects from "./_components/projects";
import TechStack from "./_components/tech-stack";

// Visitor journey: who → impact → strengths → where → what → how → stack → seniority → background → contact.
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Capabilities />
      <Experience />
      <Projects />
      <Architecture />
      <TechStack />
      <Leadership />
      <Education />
      <Contact />
    </>
  );
}
