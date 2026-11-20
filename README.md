# Sakshi Shevkari — Portfolio

A dark, typography-led single-page portfolio. Current phase is **Phase 2 — Cinematic Intro and Particle Portrait**.

## Development

Node.js 20.9+ and npm are required.

```sh
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

The default development URL is http://localhost:3000. `npm start` serves a completed production build. Next.js fetches the Google fonts at build time and self-hosts them.

## Architecture

- `src/app/` contains the layout, page composition, and CSS design system.
- `src/data/portfolio.ts` holds editable identity, education, experience, skills, projects, and contact content.
- `src/components/` contains the five sections and the client controls for navigation, email copy, the intro, and the portrait.
- `src/lib/animations.ts` runs Lenis on the shared GSAP ticker and forwards scroll updates to ScrollTrigger. `src/lib/particles.ts` samples the portrait once and renders it on a single Canvas with typed arrays.
- `.chrome-text`, `.glass`, `.display`, `.technical`, `.eyebrow`, `.pill`, and `.button` are shared styles.

The intro runs on a normal page load at the top. Skip Intro and reduced-motion preferences show the final hero directly. Deep links go straight to their section. ScrollTrigger scatters and reforms the particles as the hero leaves and reenters the viewport. The canvas pauses when the hero or tab is hidden. Dispatch `portfolio:reform-particles` to request a reform from another component.

## Assets and remaining phases

Phase 2 uses the supplied `sakshi-portfolio-portrait.jpg`, `iris-liveness.jpg`, and `erp-deployment.png` from `public/images/`. The Bug Lifespan and Restaurant Reservation media slots and personal GitHub and LinkedIn URLs still await approved inputs.

Phase 3 will cover About, Stack, and section motion. Services and Projects choreography and final contact polish remain future work.
