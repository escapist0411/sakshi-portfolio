"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations";

const MOTION_ALLOWED = "(prefers-reduced-motion: no-preference)";
const FINE_DESKTOP = `(min-width: 1025px) and (pointer: fine) and (hover: hover) and ${MOTION_ALLOWED}`;

function revealContact(section: HTMLElement) {
  const headline = section.querySelector(".contact-heading");
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  timeline.from(section.querySelectorAll(".availability"), { opacity: 0, y: 7, duration: 0.4 }, 0);
  if (headline) {
    timeline.fromTo(headline, { clipPath: "inset(-12% -7% 100% -7%)", y: 10 }, {
      clipPath: "inset(-12% -7% -12% -7%)", y: 0, duration: 0.56, clearProps: "clipPath,transform",
    }, 0.11);
  }
  timeline
    .from(section.querySelectorAll(".contact-description"), { opacity: 0, y: 10, duration: 0.46 }, 0.29)
    .from(section.querySelectorAll(".contact-actions > *"), { opacity: 0, y: 8, duration: 0.42, stagger: 0.075 }, 0.45)
    .from(section.querySelectorAll(".contact-card"), { opacity: 0, y: 12, duration: 0.52 }, 0.48);

  ScrollTrigger.create({
    trigger: section,
    start: "top 87%",
    onEnter: () => { timeline.play(); },
    onRefresh(trigger) {
      if (trigger.scroll() >= trigger.start) timeline.play();
    },
  });

  function showOnFocus(event: FocusEvent) {
    if (event.target instanceof HTMLElement && event.target.matches(":focus-visible")) timeline.progress(1);
  }
  section.addEventListener("focusin", showOnFocus);
  return () => section.removeEventListener("focusin", showOnFocus);
}

function bindMagneticLinks(section: HTMLElement) {
  const cleanups = Array.from(section.querySelectorAll<HTMLAnchorElement>("[data-contact-magnetic]"), link => {
    const x = gsap.quickTo(link, "x", { duration: 0.32, ease: "power3.out" });
    const y = gsap.quickTo(link, "y", { duration: 0.32, ease: "power3.out" });

    function reset() {
      x(0);
      y(0);
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || link.matches(":focus-visible")) return;
      const box = link.getBoundingClientRect();
      const dx = (event.clientX - box.left - box.width / 2) * 0.17;
      const dy = (event.clientY - box.top - box.height / 2) * 0.28;
      const limit = Math.max(1, Math.hypot(dx, dy) / 8);
      x(dx / limit);
      y(dy / limit);
    }

    link.addEventListener("pointermove", move, { passive: true });
    link.addEventListener("pointerleave", reset);
    link.addEventListener("focus", reset);
    return () => {
      link.removeEventListener("pointermove", move);
      link.removeEventListener("pointerleave", reset);
      link.removeEventListener("focus", reset);
    };
  });
  return () => cleanups.forEach(cleanup => cleanup());
}

export default function ContactMotion() {
  useEffect(() => {
    const section = document.getElementById("contact");
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const motion = gsap.matchMedia();
    motion.add(MOTION_ALLOWED, () => revealContact(section), section);
    motion.add(FINE_DESKTOP, () => bindMagneticLinks(section), section);
    return () => motion.revert();
  }, []);

  return null;
}
