"use client";

import { useEffect, useRef } from "react";
import { gsap, PHONE, PORTRAIT_FORM, PORTRAIT_SETTLE, REDUCED_MOTION, ScrollTrigger, setupSmoothScroll } from "@/lib/animations";

type Props = { firstName: string };

export default function Preloader({ firstName }: Props) {
  const screen = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const overlay = screen.current;
    const skipButton = skip.current;
    const content = document.querySelector<HTMLElement>("[data-intro-content]");
    const hero = document.getElementById("home");
    const title = document.getElementById("hero-title");
    if (!overlay || !skipButton || !content || !hero || !title) return;

    const root = document.documentElement;
    const reduced = window.matchMedia(REDUCED_MOTION);
    const mobile = window.matchMedia(PHONE).matches;
    const previouslyInert = content.inert;
    let smooth: ReturnType<typeof setupSmoothScroll> | undefined;
    let intro: gsap.Context | undefined;
    let watchdog: number | undefined;
    let running = false;

    function release() {
      window.clearTimeout(watchdog);
      running = false;
      try {
        intro?.revert();
      } finally {
        intro = undefined;
        if (content) content.inert = previouslyInert;
        smooth?.start();
      }
    }

    function finish(settle = false) {
      const restoreFocus = document.activeElement === skipButton;
      root.dataset.intro = "complete";
      try {
        release();
      } finally {
        if (settle) window.dispatchEvent(new Event(PORTRAIT_SETTLE));
        if (restoreFocus) title?.focus({ preventScroll: true });
      }
      if (smooth) ScrollTrigger.refresh();
    }

    function syncMotion() {
      if (reduced.matches) {
        if (smooth) {
          smooth.destroy();
          smooth = undefined;
        }
        finish(true);
      } else {
        try {
          gsap.registerPlugin(ScrollTrigger);
          smooth ??= setupSmoothScroll();
        } catch {
          finish(true);
        }
      }
    }

    function startIntro() {
      if (!overlay || !content || !hero || !title || root.dataset.intro === "complete") return;
      const portrait = hero.querySelector("[data-portrait-slot]");
      const navbar = content.querySelector(".site-header");
      const identity = hero.querySelector(".hero-identity");
      const details = hero.querySelectorAll("[data-intro-detail]");
      const glow = overlay.querySelector(".intro-glow");
      const backdrop = overlay.querySelector(".intro-backdrop");
      const name = overlay.querySelector(".intro-name");
      const letters = overlay.querySelectorAll(".intro-letter");
      if (window.scrollY > 4 || (location.hash && location.hash !== "#home") || !portrait || !navbar || !identity || !glow || !backdrop || !name) {
        finish(true);
        return;
      }

      root.dataset.intro = "running";
      running = true;
      content.inert = true;
      // This timer is independent of GSAP, so an interrupted timeline cannot trap scroll.
      watchdog = window.setTimeout(() => finish(true), mobile ? 5400 : 7100);
      try {
        smooth?.stop();
        intro = gsap.context(() => {});
        intro.add(() => {
          gsap.timeline({ onComplete: () => finish() })
            .set([portrait, identity, navbar, ...details], { opacity: 0 }, 0)
            .set(title, { clipPath: "inset(-12% 100% -12% -4%)", filter: "blur(8px)", y: 16, opacity: 0 }, 0)
            .set(letters, {
              x: (index: number) => (index - (letters.length - 1) / 2) * (mobile ? 9 : 16),
              y: (index: number) => index % 2 ? -21 : 18,
              rotation: (index: number) => index % 2 ? -5 : 5,
              filter: "blur(9px)",
              opacity: 0,
            }, 0)
            .fromTo(glow, { scale: 0.3, opacity: 0 }, { scale: 1.35, opacity: 1, duration: 0.56, ease: "power2.out" }, 0.05)
            .to(glow, { scale: 0.8, opacity: 0, duration: 0.38 }, 0.62)
            .to(letters, { x: 0, y: 0, rotation: 0, filter: "blur(0px)", opacity: 1, duration: 0.96, stagger: 0.076, ease: "power3.out" }, 0.72)
            .to(name, { "--sweep": "215%", duration: 0.72, ease: "power2.inOut" }, 2.01)
            .to(name, { clipPath: "inset(-18% -5% -18% 100%)", x: 22, opacity: 0, filter: "blur(9px)", duration: 0.72, ease: "power2.in" }, 2.77)
            .call(() => window.dispatchEvent(new Event(PORTRAIT_FORM)), [], 3.07)
            .to(backdrop, { opacity: 0, duration: 0.82, ease: "power2.inOut" }, 3.09)
            .to(portrait, { opacity: 1, duration: 0.78 }, 3.16)
            // Reveal the actual hero title, so the transition has no duplicate title to align.
            .to(title, { clipPath: "inset(-12% -4% -12% -4%)", filter: "blur(0px)", y: 0, opacity: 1, duration: 1.52, ease: "power3.out" }, 3.26)
            .fromTo(identity, { y: 15 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 4.76)
            .to(details, { opacity: 1, duration: 0.58 }, 5.08)
            .fromTo(navbar, { y: -9 }, { y: 0, opacity: 1, duration: 0.54, ease: "power2.out" }, 5.51)
            .timeScale(mobile ? 1.3 : 1);
        });
      } catch {
        finish(true);
      }
    }

    const skipIntro = () => finish(true);
    const restorePage = (event: PageTransitionEvent) => {
      if (event.persisted && running) finish(true);
    };
    syncMotion();
    const frame = window.requestAnimationFrame(startIntro);
    reduced.addEventListener("change", syncMotion);
    skipButton.addEventListener("click", skipIntro);
    window.addEventListener("pageshow", restorePage);

    return () => {
      window.cancelAnimationFrame(frame);
      reduced.removeEventListener("change", syncMotion);
      skipButton.removeEventListener("click", skipIntro);
      window.removeEventListener("pageshow", restorePage);
      if (running) delete root.dataset.intro;
      try {
        release();
      } finally {
        smooth?.destroy();
      }
    };
  }, []);

  return (
    <div className="intro-screen" ref={screen} role="dialog" aria-modal="true" aria-label="Portfolio introduction">
      <div className="intro-backdrop" aria-hidden="true">
        <span className="intro-glow" />
        <div className="intro-name">
          {[...firstName.toUpperCase()].map((letter, index) => (
            <span className="intro-letter chrome-text" key={index}>{letter}</span>
          ))}
        </div>
      </div>
      <button className="intro-skip technical" ref={skip} type="button">Skip intro</button>
    </div>
  );
}
