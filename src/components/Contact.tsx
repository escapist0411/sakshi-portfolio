import { ArrowRight, ArrowUp } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import ContactMotion from "./ContactMotion";
import CopyEmail from "./CopyEmail";

export default function Contact() {
  const emailLink = `mailto:${portfolio.email}`;
  const socials = portfolio.contact.socials.filter(social => social.url);

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <span className="pill availability"><span className="status-dot" aria-hidden="true" />{portfolio.contact.availability}</span>
      <div className="contact-grid">
        <div>
          <h2 id="contact-title" className="display contact-heading">LET’S BUILD<br /><em>INTELLIGENT</em><br />SYSTEMS.</h2>
          <p className="contact-description">{portfolio.contact.description}</p>
          <div className="contact-actions">
            <div>
              <a className="button button-primary" href={emailLink} data-contact-magnetic>
                SEND AN EMAIL <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
            <CopyEmail email={portfolio.email} />
          </div>
        </div>
        <aside className="glass contact-card" aria-label="Contact information">
          <div><h3 className="technical">EMAIL</h3><a href={emailLink}>{portfolio.email}</a></div>
          <div><h3 className="technical">BASED IN</h3><p>{portfolio.location}</p></div>
          <div><h3 className="technical">FOCUS</h3><p>{portfolio.contact.focus}</p></div>
          {socials.length > 0 && (
            <div>
              <h3 className="technical">ELSEWHERE</h3>
              <div className="socials">{socials.map(social => <a key={social.name} href={social.url ?? undefined}>{social.name}</a>)}</div>
            </div>
          )}
        </aside>
      </div>
      <footer className="footer technical">
        <span>© 2026 {portfolio.name.toUpperCase()}. ALL RIGHTS RESERVED.</span>
        <a href="#home" data-contact-magnetic>BACK TO TOP <ArrowUp size={16} aria-hidden="true" /></a>
      </footer>
      <ContactMotion />
    </section>
  );
}
