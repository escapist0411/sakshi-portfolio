"use client";

import { useEffect } from "react";
import { gsap, PHONE, REDUCED_MOTION, ScrollTrigger } from "@/lib/animations";

const titleHidden = "inset(-12% -6% 100% -6%)";
const titleVisible = "inset(-12% -6% -12% -6%)";

function revealSections(main: HTMLElement, compact: boolean) {
  const about = main.querySelector<HTMLElement>("#about");
  const services = main.querySelector<HTMLElement>("#services");
  const projects = main.querySelector<HTMLElement>("#projects");
  if (!about || !services || !projects) return;

  const step = compact ? 11 : 18;
  const reveals: { trigger: Element; start: string; timeline: gsap.core.Timeline }[] = [];
  const focusGroups: { area: Element; timeline: gsap.core.Timeline }[] = [];

  function reveal(trigger: Element, start = "top 90%") {
    const timeline = gsap.timeline({
      defaults: { duration: compact ? 0.48 : 0.66, ease: "power3.out" },
      paused: true,
    });
    reveals.push({ trigger, start, timeline });
    return timeline;
  }

  function heading(trigger: HTMLElement, section: HTMLElement) {
    const label = section.querySelector(".eyebrow");
    const title = section.querySelector("h2");
    const mark = label?.querySelector(".status-dot");
    const timeline = reveal(trigger);
    if (mark) timeline.from(mark, { opacity: 0, scale: 0.5, duration: 0.32 }, 0);
    if (label) timeline.from(label, { opacity: 0, y: step * 0.55, duration: 0.43 }, mark ? 0.08 : 0);
    if (title) {
      timeline.fromTo(title, { clipPath: titleHidden, y: step }, {
        clipPath: titleVisible, y: 0, clearProps: "clipPath,transform",
      }, 0.14);
    }
    return timeline;
  }

  const aboutGrid = about.querySelector<HTMLElement>(".about-grid");
  const bio = about.querySelector<HTMLElement>(".bio-panel");
  if (aboutGrid && bio) {
    const aboutTitle = heading(aboutGrid, about);
    const biography = compact ? reveal(bio, "top 93%") : aboutTitle;
    const start = compact ? 0 : 0.24;
    biography
      .from(bio, { opacity: 0, y: step }, start)
      .from(bio.querySelectorAll(".education > *"), { opacity: 0, y: step * 0.55, duration: 0.45, stagger: 0.06 }, start + 0.23);
    aboutTitle.from(about.querySelectorAll(".editorial-note"), { opacity: 0, y: step }, 0.45);
  }

  heading(services, services);
  const rows = services.querySelector(".service-list");
  if (rows) {
    reveal(rows, "top 91%").from(rows.children, { opacity: 0, y: step, stagger: compact ? 0.055 : 0.075 });
  }

  heading(projects, projects);
  projects.querySelectorAll(".project-entry").forEach(article => {
    const media = article.querySelector(".project-media");
    const copy = article.querySelector(".project-copy");
    const visual = media?.querySelector(".project-visual");
    if (!media || !copy || !visual) return;

    const timeline = reveal(article, "top 91%")
      .fromTo(media, { clipPath: "inset(0 0 100% 0)", opacity: 0.35 }, {
        clipPath: "inset(0 0 0% 0)", opacity: 1, clearProps: "clipPath,opacity",
      }, 0)
      .from(copy, { opacity: 0, y: step }, 0.14)
      .from(copy.querySelectorAll(".project-index"), { opacity: 0, x: -step * 0.7, duration: 0.48 }, 0.23)
      .from(copy.querySelectorAll(".project-tags li"), { opacity: 0, y: 6, duration: 0.4, stagger: 0.055 }, 0.37);
    focusGroups.push({ area: article, timeline });

    if (!compact) {
      gsap.fromTo(visual, { y: -18 }, {
        y: 18,
        ease: "none",
        scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true },
      });
    }
  });

  for (const { trigger, start, timeline } of reveals) {
    // Keep the trigger registered during refresh. The timeline itself stays at its end after playing once.
    ScrollTrigger.create({
      trigger,
      start,
      onEnter: () => { timeline.play(); },
      onRefresh(instance) {
        if (instance.scroll() >= instance.end) timeline.progress(1);
        else if (instance.scroll() >= instance.start) timeline.play();
      },
    });
  }

  const stack = about.querySelector<HTMLElement>(".stack");
  const observer = stack && typeof IntersectionObserver !== "undefined" && new IntersectionObserver(([entry]) => {
    stack.toggleAttribute("data-marquee-visible", entry.isIntersecting);
  });
  if (stack && observer) {
    stack.setAttribute("data-marquee-enabled", "");
    observer.observe(stack);
  }

  function revealFocusedProject(event: FocusEvent) {
    if (!(event.target instanceof Element) || !event.target.matches("a[href]")) return;
    const target = event.target;
    const group = focusGroups.find(({ area }) => area.contains(target));
    group?.timeline.progress(1);
  }

  main.addEventListener("focusin", revealFocusedProject);
  return () => {
    if (observer) observer.disconnect();
    stack?.removeAttribute("data-marquee-visible");
    stack?.removeAttribute("data-marquee-enabled");
    main.removeEventListener("focusin", revealFocusedProject);
  };
}

export default function SectionMotion() {
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ compact: PHONE, reduced: REDUCED_MOTION, always: "all" }, context => {
      if (context.conditions?.reduced) return;
      return revealSections(main, !!context.conditions?.compact);
    }, main);
    return () => media.revert();
  }, []);

  return null;
}
