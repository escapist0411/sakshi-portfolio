"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, PHONE, PORTRAIT_FORM, PORTRAIT_REFORM, PORTRAIT_SETTLE, REDUCED_MOTION, ScrollTrigger } from "@/lib/animations";
import { createPortraitRenderer, samplePortrait } from "@/lib/particles";

export default function ParticleFace({ src }: { src: string }) {
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = layer.current;
    const surface = canvas.current;
    const bounds = frame.current;
    const hero = container?.closest("section");
    const title = hero?.querySelector(".hero-title-motion");
    if (!container || !surface || !bounds || !hero) return;

    const reduced = window.matchMedia(REDUCED_MOTION);
    const phone = window.matchMedia(PHONE);
    const tablet = window.matchMedia("(max-width: 1024px)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1025px)");
    let renderer: ReturnType<typeof createPortraitRenderer> | undefined;
    let motion: gsap.Context | undefined;
    let mode = "waiting";
    let formationStarted = 0;
    let usable = true;
    let ticking = false;
    let visible = hero.getBoundingClientRect().bottom > 0;
    let elapsed = 0;
    let resizeFrame = 0;
    const root = document.documentElement;

    function clearPointer() {
      renderer?.setPointer(-1000, -1000);
    }

    function point(event: PointerEvent) {
      if (!surface || !finePointer.matches || reduced.matches || event.pointerType !== "mouse" || root.dataset.intro === "running") return;
      const box = surface.getBoundingClientRect();
      renderer?.setPointer(event.clientX - box.left, event.clientY - box.top);
    }

    function stopDrawing() {
      if (ticking) gsap.ticker.remove(tick);
      ticking = false;
      elapsed = 0;
      if (surface) surface.dataset.rendering = "paused";
    }

    function fallback() {
      stopDrawing();
      motion?.revert();
      motion = undefined;
      renderer = undefined;
      if (surface) delete surface.dataset.particles;
      if (container) container.dataset.portrait = "fallback";
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
      const shouldDraw = !!renderer && mode !== "waiting" && visible && !document.hidden && !reduced.matches;
      if (shouldDraw && !ticking) {
        ticking = true;
        if (surface) surface.dataset.rendering = "running";
        gsap.ticker.add(tick);
      } else if (!shouldDraw && ticking) {
        stopDrawing();
      }
    }

    function syncMotion() {
      if (!renderer || !hero) return;
      try {
        if (reduced.matches) {
          motion?.revert();
          motion = undefined;
          clearPointer();
          mode = "settled";
          renderer.setScatter(0);
          renderer.settle();
          renderer.draw(0, true);
        } else if (!motion) {
          gsap.registerPlugin(ScrollTrigger);
          motion = gsap.context(() => {});
          motion.add(() => {
            const scrub = { progress: 0 };
            gsap.to(scrub, {
              progress: 1,
              ease: "none",
              onUpdate: () => renderer?.setScatter(scrub.progress),
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
            });
            if (title) {
              gsap.to(title, {
                y: () => -Math.min(42, hero.clientHeight * 0.05),
                ease: "none",
                scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
              });
            }
          });
        }
        syncDrawing();
      } catch {
        fallback();
      }
    }

    function measure() {
      if (!renderer || !surface || !bounds) return;
      const viewport = surface.getBoundingClientRect();
      const fit = bounds.getBoundingClientRect();
      const screen = phone.matches ? "mobile" : tablet.matches ? "tablet" : "desktop";
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
      if (reduced.matches) renderer.draw(0, true);
    }

    function resize() {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        try {
          measure();
        } catch {
          fallback();
        }
      });
    }

    function form() {
      mode = "forming";
      formationStarted = performance.now();
      renderer?.form();
      syncDrawing();
    }

    function settle() {
      mode = "settled";
      renderer?.settle();
      if (reduced.matches) renderer?.draw(0, true);
      syncDrawing();
    }

    const reform = () => renderer?.reform();
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) clearPointer();
      syncDrawing();
    });
    const layout = new ResizeObserver(resize);
    visibility.observe(hero);
    layout.observe(container);
    layout.observe(bounds);
    window.addEventListener("resize", resize);
    window.addEventListener(PORTRAIT_FORM, form);
    window.addEventListener(PORTRAIT_SETTLE, settle);
    window.addEventListener(PORTRAIT_REFORM, reform);
    hero.addEventListener("pointermove", point, { passive: true });
    hero.addEventListener("pointerleave", clearPointer);
    document.addEventListener("visibilitychange", syncDrawing);
    reduced.addEventListener("change", syncMotion);

    async function load() {
      if (!surface || !container) return;
      try {
        const context = surface.getContext("2d");
        if (!context) throw new Error("Canvas rendering is unavailable");
        const samples = await samplePortrait(src);
        if (!usable) return;
        renderer = createPortraitRenderer(surface, context, samples);
        measure();
        if (reduced.matches || root.dataset.intro === "complete" || mode === "settled") settle();
        else if (mode === "forming") {
          if (performance.now() - formationStarted < 450) renderer.form();
          else settle();
        }
        container.dataset.portrait = "ready";
        syncMotion();
      } catch {
        if (usable) fallback();
      }
    }
    void load();

    return () => {
      usable = false;
      stopDrawing();
      motion?.revert();
      window.cancelAnimationFrame(resizeFrame);
      visibility.disconnect();
      layout.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener(PORTRAIT_FORM, form);
      window.removeEventListener(PORTRAIT_SETTLE, settle);
      window.removeEventListener(PORTRAIT_REFORM, reform);
      hero.removeEventListener("pointermove", point);
      hero.removeEventListener("pointerleave", clearPointer);
      document.removeEventListener("visibilitychange", syncDrawing);
      reduced.removeEventListener("change", syncMotion);
    };
  }, [src]);

  return (
    <div className="portrait-canvas-layer" data-portrait-slot data-portrait="pending" ref={layer} aria-hidden="true">
      <div className="portrait-frame" ref={frame}>
        <Image
          className="portrait-fallback"
          src={src}
          alt=""
          fill
          unoptimized
          loading="eager"
          onError={event => { event.currentTarget.hidden = true; }}
        />
      </div>
      <canvas ref={canvas} />
    </div>
  );
}
