import { portfolio } from "@/data/portfolio";

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="about-grid">
        <div>
          <p className="eyebrow">ABOUT ME</p>
          <h2 id="about-title" className="display intro-title">INTRO<span className="accent">.</span></h2>
          <p className="editorial-note">Curiosity meets<br /><em>engineering.</em></p>
        </div>
        <div className="glass bio-panel">
          <p className="bio-lead">Building with intention.<br /><span>Learning through practice.</span></p>
          <p>{portfolio.about}</p>
          <div className="education">
            <span className="technical">EDUCATION / {portfolio.education.period}</span>
            <h3>BCA (Science)</h3>
            <p>{portfolio.education.college}</p>
            <p className="technical">CGPA <strong>{portfolio.education.cgpa}</strong></p>
          </div>
        </div>
      </div>
      <div className="stack">
        <div className="section-meta">
          <h3 className="technical">THE STACK</h3>
          <label className="stack-control technical">
            <input type="checkbox" /> Pause motion
          </label>
        </div>
        {portfolio.skills.map((row, index) => (
          <div className="stack-row" key={row[0]} style={{ "--marquee-duration": `${32 + index * 3}s` } as React.CSSProperties}>
            <div className="stack-track">
              {[false, true].map(duplicate => (
                <ul className="stack-group" key={String(duplicate)} aria-hidden={duplicate || undefined} role="list">
                  {row.map((skill, skillIndex) => (
                    <li key={skill} className={skillIndex === (index + 1) % row.length ? "stack-emphasis" : undefined}>
                      <span>{skill}</span><span className="stack-separator" aria-hidden="true">·</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
