"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation, portfolio } from "@/data/portfolio";
import { gsap, ScrollTrigger } from "@/lib/animations";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = progress.current;
    const nav = header.current;
    if (!bar || !nav) return;

    const sections = navigation.flatMap(name => {
      const element = document.getElementById(name.toLowerCase());
      return element ? [{ element, top: 0 }] : [];
    });
    gsap.registerPlugin(ScrollTrigger);
    const setScale = gsap.quickSetter(bar, "scaleX");
    let current = "home";
    let offset = 0;

    function update(trigger: ScrollTrigger) {
      setScale(trigger.progress);
      const readingPosition = trigger.scroll() + offset;
      const section = trigger.progress >= 0.999 && trigger.end > 1
        ? sections.at(-1)
        : sections.findLast(item => item.top <= readingPosition);
      const id = section?.element.id ?? "home";
      if (id === current) return;
      current = id;
      setActive(id);
    }

    const tracking = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: update,
      onRefresh(trigger) {
        const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || nav.offsetHeight;
        offset = padding + 24;
        const scroll = trigger.scroll();
        sections.forEach(section => { section.top = section.element.getBoundingClientRect().top + scroll; });
        update(trigger);
      },
    });

    return () => {
      tracking.kill();
      bar.style.removeProperty("transform");
    };
  }, []);

  return (
    <header className="site-header" ref={header} onKeyDown={event => {
      if (event.key !== "Escape" || !open) return;
      setOpen(false);
      toggle.current?.focus();
    }}>
      <div className="nav-inner">
        <a className="wordmark" href="#home" onClick={() => setOpen(false)}>{portfolio.name}</a>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >{open ? <X /> : <Menu />}</button>
        <nav id="navigation" className={open ? "navigation is-open" : "navigation"} aria-label="Main navigation">
          {navigation.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} aria-current={active === item.toLowerCase() ? "location" : undefined} onClick={() => setOpen(false)}>{item}</a>
          ))}
        </nav>
      </div>
      <div className="scroll-progress-track" aria-hidden="true"><div className="scroll-progress-line" ref={progress} /></div>
    </header>
  );
}
