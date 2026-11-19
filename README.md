# Sakshi Shevkari — Portfolio

A dark, typography-led single-page portfolio. **Current phase: Phase 1 — Foundation + Design System.**

## Development

Node.js 20.9+ and npm are required.

```sh
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

The development preview is at http://localhost:3000. `npm start` serves a completed production build. Google font files are fetched during build by `next/font`, then self-hosted by Next.js.

## Stack and architecture

Next.js App Router, TypeScript, Tailwind CSS, Lucide React. GSAP (including its ScrollTrigger module) and Lenis are installed for later phases and are not initialized or shipped through page imports in Phase 1. No Three.js.

- `src/app/`: layout, metadata, page composition, global design tokens and responsive styles.
- `src/data/portfolio.ts`: editable identity, education, experience, skills, research, projects, learning, and contact content.
- `src/components/`: Navbar, Hero, About, Services, Projects, Play, Contact, and CopyEmail.
- Only Navbar and CopyEmail are client components. Navigation uses native anchors, a mobile disclosure, Escape dismissal, and section observation. Clipboard feedback includes an accessible failure state.
- `.chrome-text`, `.glass`, `.display`, `.technical`, `.eyebrow`, `.pill`, and `.button` form the shared visual system.
- Six semantic sections: `home`, `about`, `services`, `projects`, `play`, `contact`.

## Asset handoff

The full-size `data-portrait-slot` in Hero is reserved for the responsive portrait canvas. Its stacking order places the background behind the portrait, then PORTFOLIO, identity, and foreground elements. Supply Sakshi’s approved portrait in Phase 2. The source background must be suppressed and the person isolated before future particle sampling.

Project media paths are defined in portfolio data and documented in `public/images/projects/README.md`. Screenshots are intentionally not loaded until supplied. No stock photography or fabricated screenshots are used. Personal GitHub and LinkedIn URLs are still required; their controls are explicitly disabled. Only the supplied iris repository is linked.

## Controlled phases

1. **Foundation + Design System — implemented.** Static layout, responsive typography, placeholders, navigation, clipboard, accessibility and reduced-motion baseline.
2. Preloader + Particle Portrait Hero.
3. About + Stack + Scroll Animation (independent stack rows are prepared).
4. Services + Projects Animation.
5. Interactive Breakout Game (the arcade is currently only a static preview).
6. Contact + Cursor + Final Polish.

Advanced animation, portrait particles, the interactive game, GSAP/Lenis initialization, velocity distortion, and custom cursor are deliberately deferred. Future modules such as ParticleFace, Preloader, CustomCursor, animations, and particle helpers should be added when implemented; no empty scaffolding is required.
