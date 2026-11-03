<img alt="A large halftone cube on a dot grid, cropped by the frame" src="docs/assets/cover.png">

# Alejandro Mejía

**Senior Design Engineer** · Navarra, Spain

[![CI](https://github.com/alejomejia/alejandromejia.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/alejomejia/alejandromejia.dev/actions/workflows/ci.yml)

I build design systems and the interfaces that use them: components, motion,
accessibility and performance. 13+ years on the web, 8+ building production
frontends in React, Next.js and TypeScript for global ecommerce, SaaS products
and high-traffic marketing platforms.

Open to Design Engineer, UX Engineer and Frontend roles, remote (EU/UK/US).

[alejandromejia.dev](https://alejandromejia.dev) ·
[LinkedIn](https://www.linkedin.com/in/alejandromejiac) ·
[GitHub](https://github.com/alejomejia)

## About this repo

The source of my portfolio: case studies, writing, small interface experiments
and my CV, all edited from a CMS that lives in the same codebase. It's a
personal site, not a template, and its content sits in a private database.

## Stack

- **Next.js 16** (App Router), **React 19** and **TypeScript**
- **Payload CMS 3** on **PostgreSQL**, running inside the Next.js app
- **Tailwind CSS 4** on an 8px grid, dark only
- **GSAP**, **Lenis** and **Tempus** for motion
- **Docker**, self-hosted with **Dokploy**

## Worth a look

- [`halftone-shape`](src/components/effects/halftone-shape): the loop on the
  cover. A ray-marched rounded box drawn as halftone dots on a 2D canvas, no
  WebGL; it pauses off screen and holds still under reduced motion.
- [`inspect-mode`](src/components/effects/inspect-mode): press <kbd>I</kbd> on
  the site to measure sizes and spacing, like Figma's inspect panel.
- [`e2e`](e2e): Playwright tests that run every page in Chromium, Firefox and
  WebKit on each push: axe at WCAG 2.2 AA, no console errors, no sideways
  scroll on a phone, plus a test for each bug fixed so far. Unit tests for
  the pure logic sit next to it as `*.test.ts`.
- [`.agents/skills`](.agents/skills): the conventions that both I and AI
  agents follow when working on the site. Mine are
  [`code-conventions`](.agents/skills/code-conventions),
  [`alejandromejia-brand`](.agents/skills/alejandromejia-brand),
  [`page-building`](.agents/skills/page-building),
  [`commits`](.agents/skills/commits) and
  [`seo-geo-audit`](.agents/skills/seo-geo-audit). The rest (`gsap-*`,
  `payload`, `vercel-react-view-transitions`, `vitest`,
  `playwright-best-practices`) are vendored from GreenSock, Payload, Vercel,
  Anthony Fu and Currents, and pinned in [`skills-lock.json`](skills-lock.json).

## License

The code is [MIT](LICENSE): take any of it. The content is not: my writing,
case studies, CV and images are all rights reserved, and the recommendations
belong to the people who wrote them. The vendored skills keep their own
licenses.
