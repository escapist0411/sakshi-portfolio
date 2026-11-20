import { ArrowDownRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import ParticleFace from "./ParticleFace";

export default function Hero() {
  return (
    <section id="home" className="hero" aria-label={`${portfolio.name}, ${portfolio.title}`}>
      <div className="hero-background" aria-hidden="true" />
      <ParticleFace src={portfolio.portrait} />
      <div className="hero-topline technical" data-intro-detail>
        <span>AI & SOFTWARE ENGINEERING</span>
        <span>{portfolio.location} <span className="small-cross">+</span></span>
      </div>
      <div className="hero-title-motion">
        <h1 id="hero-title" className="hero-title chrome-text" aria-label={`Portfolio of ${portfolio.name}, ${portfolio.title}`} tabIndex={-1}>PORTFOLIO</h1>
      </div>
      <div className="hero-identity">
        <p className="technical">{portfolio.name}</p>
        <h2>AI &<br /><em>Software Engineer</em></h2>
      </div>
      <div className="hero-bottom technical" data-intro-detail>
        <span>RESEARCH. DEVELOP. DEPLOY.</span>
        <a href="#about">SCROLL TO EXPLORE <ArrowDownRight size={18} /></a>
        <span className="hero-edition">PORTFOLIO / 2026</span>
      </div>
    </section>
  );
}
