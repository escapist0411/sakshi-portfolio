import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Preloader from "@/components/Preloader";
import { portfolio } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <Preloader firstName={portfolio.name.split(" ")[0]} />
      <div data-intro-content>
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Services />
          <Projects />
          <Contact />
        </main>
      </div>
    </>
  );
}
