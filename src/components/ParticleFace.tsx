"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, PHONE, PORTRAIT_COMPLETE, PORTRAIT_FORM, PORTRAIT_SETTLE, REDUCED_MOTION, ScrollTrigger } from "@/lib/animations";
import { createPortraitRenderer, samplePortrait } from "@/lib/particles";

export default function ParticleFace({ src }: { src: string }) {
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = layer.current?.closest("section");
    const photoMotion = frame.current?.querySelector(".portrait-photo-motion");
    const title = hero?.querySelector(".hero-title-motion");
    if (!layer.current || !canvas.current || !frame.current || !hero || !photoMotion) return;
    const container = layer.current;
    const surface = canvas.current;
    const bounds = frame.current;

    gsap.registerPlugin(ScrollTrigger);
    const scrollMotion = gsap.matchMedia();
    scrollMotion.add("(prefers-reduced-motion: no-preference)", () => {
      const scroll = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      gsap.to(photoMotion, { y: -28, scale: 1.03, opacity: 0, ease: "none", scrollTrigger: { ...scroll } });
      if (title) {
        gsap.to(title, {
          y: () => -Math.min(42, hero.clientHeight * 0.05), ease: "none",
          scrollTrigger: { ...scroll, invalidateOnRefresh: true },
        });
      }
    }, hero);

    const reduced = window.matchMedia(REDUCED_MOTION);
    if (reduced.matches || document.documentElement.dataset.intro === "complete") {
      return () => scrollMotion.revert();
    }

    const phone = window.matchMedia(PHONE);
    const tablet = window.matchMedia("(max-width: 1024px)");
    let renderer: ReturnType<typeof createPortraitRenderer> | undefined;
    let phase: "waiting" | "forming" | "settled" | "complete" = "waiting";
    let ticking = false;
    let elapsed = 0;

    function stopDrawing() {
      if (ticking) gsap.ticker.remove(tick);
      ticking = false;
      elapsed = 0;
      surface.dataset.rendering = "paused";
    }

    function releaseParticles() {
      phase = "complete";
      stopDrawing();
      renderer = undefined;
      layout.disconnect();
      window.removeEventListener(PORTRAIT_FORM, form);
      window.removeEventListener(PORTRAIT_SETTLE, settle);
      window.removeEventListener(PORTRAIT_COMPLETE, releaseParticles);
      document.removeEventListener("visibilitychange", syncDrawing);
      // The photo is now the only live portrait. Free the full-size canvas backing buffer.
      surface.width = 1;
      surface.height = 1;
    }

    function fallback() {
      container.dataset.portrait = "fallback";
      releaseParticles();
    }

    function tick(_: number, delta: number) {
      elapsed += delta;
      if (phone.matches && elapsed < 24) return;
      try {
        renderer?.draw(elapsed / 1000);
      } catch {
        fallback();
      }
      elapsed = 0;
    }

    function syncDrawing() {
      const shouldDraw = !!renderer && phase === "forming" && !document.hidden && !reduced.matches;
      if (shouldDraw && !ticking) {
        ticking = true;
        surface.dataset.rendering = "running";
        gsap.ticker.add(tick);
      } else if (!shouldDraw && ticking) {
        stopDrawing();
      }
    }

    function settle() {
      phase = "settled";
      stopDrawing();
      try {
        renderer?.settle();
        renderer?.draw(0, true);
      } catch {
        fallback();
      }
    }

    function measure() {
      if (!renderer) return;
      const viewport = surface.getBoundingClientRect();
      const fit = bounds.getBoundingClientRect();
      const screen = phone.matches ? "mobile" : tablet.matches ? "tablet" : "desktop";
      try {
        renderer.resize({
          width: viewport.width,
          height: viewport.height,
          dpr: Math.min(window.devicePixelRatio || 1, screen === "mobile" ? 1.35 : 1.75),
          left: fit.left - viewport.left,
          top: fit.top - viewport.top,
          portraitWidth: fit.width,
          portraitHeight: fit.height,
          screen,
        });
        if (phase === "settled") renderer.draw(0, true);
      } catch {
        fallback();
      }
    }

    function form() {
      phase = "forming";
      renderer?.form();
      syncDrawing();
    }

    async function load() {
      try {
        const context = surface.getContext("2d");
        if (!context) throw new Error("Canvas rendering is unavailable");
        const samples = await samplePortrait(src);
        if (phase === "complete") return;
        // A slow load must not interrupt the photo reveal with an unformed portrait.
        if (phase === "settled") return fallback();
        renderer = createPortraitRenderer(surface, context, samples);
        measure();
        if (!renderer) return;
        container.dataset.portrait = "ready";
        if (phase === "forming") form();
      } catch {
        if (phase !== "complete") fallback();
      }
    }

    const layout = new ResizeObserver(measure);
    layout.observe(container);
    layout.observe(bounds);
    window.addEventListener(PORTRAIT_FORM, form);
    window.addEventListener(PORTRAIT_SETTLE, settle);
    window.addEventListener(PORTRAIT_COMPLETE, releaseParticles);
    document.addEventListener("visibilitychange", syncDrawing);
    void load();

    return () => {
      releaseParticles();
      scrollMotion.revert();
    };
  }, [src]);

  return (
    <div className="hero-portrait" data-portrait-slot data-portrait="pending" ref={layer}>
      <div className="portrait-frame" ref={frame}>
        <div className="portrait-photo-motion">
          <Image className="portrait-photo" src={src} alt="Portrait of Sakshi Shevkari" fill unoptimized loading="eager" />
        </div>
      </div>
      <canvas ref={canvas} width={1} height={1} aria-hidden="true" />
    </div>
  );
}
