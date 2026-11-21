# Sakshi Shevkari — Portfolio

The single-page portfolio of Sakshi Shevkari, AI & Software Engineer. It covers machine learning research, full-stack development, and deployment experience.

## Development

Use Node.js 20.9 or newer.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

The development server usually starts at `http://localhost:3000`. Run `npm start` after a successful build to preview the production bundle. Next.js fetches the Google fonts at build time and serves them locally.

## Stack and structure

Next.js App Router, TypeScript, Tailwind CSS, GSAP and ScrollTrigger, Lenis, and HTML Canvas.

- `src/app/` holds the page, metadata, monogram icon, and global styles. `src/data/portfolio.ts` is the source for Sakshi’s biography, skills, projects, experience, and contact details.
- The skippable cinematic intro forms a Canvas particle portrait, then crossfades to Sakshi’s photo. The app stops rendering particles after the handoff. Lenis uses the shared GSAP ticker for smooth navigation, with scroll progress and active section tracking.
- About and Services reveal as they enter the viewport. The four technology marquees can be paused by keyboard and pause offscreen. The four-project showcase pairs the supplied Iris and ERP visuals with CSS workflow diagrams for Bug Lifespan and Restaurant Reservation.
- Contact includes an email link, copy feedback and fallback, and Back to Top. Magnetic movement is limited to the email CTA and Back to Top on desktop with a fine pointer. Reduced-motion preferences show the photo immediately and disable marquee motion, section reveals, and parallax.

## Optional updates

Add personal LinkedIn or other social links once Sakshi supplies them. Approved screenshots can replace the CSS workflow diagrams. A dedicated Open Graph image can supplement the current text share metadata.
