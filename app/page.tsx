import About from "./_components/about";
import Contact from "./_components/contact";
import Education from "./_components/education";
import Experience from "./_components/experience";
import Expertise from "./_components/expertise";
import Hero from "./_components/hero";
import Projects from "./_components/projects";
import Skills from "./_components/skills";

// Visitor journey: who → background → where → what → how → stack → education → contact.
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Expertise />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}
