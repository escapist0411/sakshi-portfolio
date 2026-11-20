import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import ProjectDiagram from "./ProjectDiagram";

export default function Projects() {
  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <p className="eyebrow"><span className="status-dot" aria-hidden="true" /> SELECTED WORK</p>
      <h2 id="projects-title" className="display projects-heading">FEATURED<br /><span className="chrome-text">ENGINEERING</span></h2>
      <div className="project-list">
        {portfolio.projects.map((project, index) => (
          <article className="project-entry" key={project.id} aria-labelledby={`project-${project.id}`}>
            <div className={`project-media media-${project.id}`}>
              <div className="project-visual">
                {project.mediaAlt ? (
                  <Image
                    className="project-image"
                    src={project.mediaPath}
                    alt={project.mediaAlt}
                    fill
                    sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1552px) 48vw, 720px"
                  />
                ) : (
                  <ProjectDiagram kind={project.id === "bugs" ? "bug-lifespan" : "table-reservation"} />
                )}
              </div>
            </div>
            <div className="project-copy">
              <p className={`technical project-status ${project.id === "bugs" ? "ongoing" : ""}`}>
                <span className="project-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span>{project.status}</span>
              </p>
              <h3 id={`project-${project.id}`}>{project.title}</h3>
              <p className="project-subtitle">{project.subtitle}</p>
              <p className="project-description">{project.description}</p>
              {"results" in project && <p className="project-results">{project.results}</p>}
              <ul className="project-tags" role="list">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
              {"href" in project && (
                <a className="text-link" href={project.href} target="_blank" rel="noopener noreferrer">
                  VIEW REPOSITORY <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
