import { portfolio } from "@/data/portfolio";
export default function About() {
  return <section id="about" className="section about"><div className="about-grid"><div><p className="eyebrow">ABOUT ME</p><h2 className="display intro-title">INTRO<span className="accent">.</span></h2><p className="editorial-note">Curiosity meets<br /><em>engineering.</em></p></div>
    <div className="glass bio-panel"><p className="bio-lead">Building with intention.<br /><span>Learning through practice.</span></p><p>{portfolio.about}</p><div className="education"><span className="technical">EDUCATION / {portfolio.education.period}</span><h3>BCA (Science)</h3><p>{portfolio.education.college}</p><p className="technical">CGPA <strong>{portfolio.education.cgpa}</strong></p></div></div></div>
    <div className="stack"><div className="section-meta"><h3 className="technical">THE STACK</h3><span className="technical">TOOLS & TECHNOLOGIES</span></div>{portfolio.skills.map((row, index) => <div key={index} className="stack-row" data-stack-row={index}>{row.map(skill => <span key={skill}>{skill}<span className="stack-separator" aria-hidden="true">•</span></span>)}</div>)}</div>
  </section>;
}
