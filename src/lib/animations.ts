import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export { gsap, ScrollTrigger };
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const PHONE = "(max-width: 760px)";
export const PORTRAIT_FORM = "portfolio:portrait-form";
export const PORTRAIT_SETTLE = "portfolio:portrait-settle";
export const PORTRAIT_COMPLETE = "portfolio:portrait-complete";

export function setupSmoothScroll() {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.105 });
  const tick = (seconds: number) => lenis.raf(seconds * 1000);
  const unsubscribe = lenis.on("scroll", ScrollTrigger.update);

  function followAnchor(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || lenis.isStopped) return;
    const link = event.target instanceof Element && event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    const hash = link && link.getAttribute("href");
    if (!hash || hash === "#main" || link.target || link.hasAttribute("download")) return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    event.preventDefault();
    if (location.hash !== hash) history.pushState(history.state, "", hash);
    const focusTarget = target.querySelector<HTMLElement>("h1,h2") ?? target;
    if (!focusTarget.hasAttribute("tabindex")) focusTarget.tabIndex = -1;
    focusTarget.focus({ preventScroll: true });
    // Lenis already reads the target's scroll margin and the document's scroll padding.
    lenis.scrollTo(hash === "#home" ? 0 : target);
  }

  gsap.ticker.add(tick);
  document.addEventListener("click", followAnchor);
  return {
    stop: () => lenis.stop(),
    start: () => lenis.start(),
    destroy() {
      document.removeEventListener("click", followAnchor);
      gsap.ticker.remove(tick);
      unsubscribe();
      lenis.destroy();
    },
  };
}
