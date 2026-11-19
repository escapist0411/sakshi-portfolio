import { ArrowDownRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
export default function Hero() {
  return <section id="home" className="hero" aria-label={`${portfolio.name}, ${portfolio.title}`}>
    <div className="hero-background" aria-hidden="true" />
    <div className="portrait-canvas-layer" data-portrait-slot aria-hidden="true"><span className="portrait-registration top-left" /><span className="portrait-registration bottom-right" /><span className="portrait-placeholder technical">PORTRAIT / AWAITING IMAGE</span></div>
    <div className="hero-topline technical"><span>AI & SOFTWARE ENGINEERING</span><span>{portfolio.location} <span className="small-cross">+</span></span></div>
    <h1 className="hero-title chrome-text">PORTFOLIO</h1>
    <div className="hero-identity"><p className="technical">{portfolio.name}</p><h2>AI &<br /><em>Software Engineer</em></h2></div>
    <div className="hero-bottom technical"><span>RESEARCH. DEVELOP. DEPLOY.</span><a href="#about">SCROLL TO EXPLORE <ArrowDownRight size={18} /></a><span className="hero-edition">PORTFOLIO / 2026</span></div>
  </section>;
}
