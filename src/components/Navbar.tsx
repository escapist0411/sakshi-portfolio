"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation, portfolio } from "@/data/portfolio";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-20% 0px -55% 0px" });
    navigation.forEach(item => { const section = document.getElementById(item.toLowerCase()); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);
  return <header className="site-header" onKeyDown={event => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } }}>
    <div className="nav-inner"><a className="wordmark" href="#home" onClick={() => setOpen(false)}>{portfolio.name}</a>
      <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="navigation" className={open ? "navigation is-open" : "navigation"} aria-label="Main navigation">{navigation.map(item => <a key={item} href={`#${item.toLowerCase()}`} aria-current={active === item.toLowerCase() ? "location" : undefined} onClick={() => setOpen(false)}>{item}</a>)}</nav>
    </div><div className="scroll-progress-track" aria-hidden="true"><div className="scroll-progress-line" /></div>
  </header>;
}
