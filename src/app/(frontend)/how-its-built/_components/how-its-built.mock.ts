import { craftPath, writingPath } from '@/lib/seo/seo.utils'

import type { HowItsBuiltSectionData } from './how-its-built.types'

// The page's content. The facts come from the code (package.json, the CI
// workflow, the e2e suite); keep them in step when the stack changes.
export const HOW_ITS_BUILT: HowItsBuiltSectionData[] = [
  {
    label: 'Stack',
    rows: [
      { label: 'Framework', text: ['Next.js 16 and React 19, with the React Compiler, in TypeScript.'] },
      {
        label: 'Content',
        text: [
          { text: 'Payload', href: 'https://payloadcms.com' },
          ' 3 on Postgres. I write everything in its admin, and a published change is live without a rebuild.',
        ],
      },
      {
        label: 'Styling',
        text: [
          'Tailwind CSS 4. All colors and sizes are tokens in one CSS file. Every size sits on an 8px grid, in rem, so the page grows with your browser’s font size.',
        ],
      },
      {
        label: 'Motion',
        text: [
          'Lenis for smooth scrolling, and Tempus to run every animation on one shared frame loop. Page changes are View Transitions, through React.',
        ],
      },
      {
        label: 'Type',
        text: [{ text: 'Geist and Geist Mono', href: 'https://vercel.com/font' }, ', by Vercel.'],
      },
      {
        label: 'Hosting',
        text: ['A Docker image on my own server, deployed with Dokploy. Images are stored in Cloudflare R2.'],
      },
    ],
  },
  {
    label: 'Details',
    rows: [
      {
        label: 'Accessibility',
        text: [
          'Every page aims for WCAG 2.2 AA. You can use all of it with the keyboard, and a skip link jumps straight to the content.',
        ],
      },
      {
        label: 'Reduced motion',
        text: [
          'If your system asks for less motion, the site stops animating. The halftone shape stays on one still frame.',
        ],
      },
      {
        label: 'Performance',
        text: ['Animations only change transform and opacity, and anything that loops pauses when it’s off screen.'],
      },
      {
        label: 'Inspect mode',
        text: [
          'Press I, or ',
          { text: 'turn it on', toggle: 'inspect' },
          ', and measure the spacing of anything here, like in Figma. The write-up is in ',
          { text: 'Craft', href: craftPath('inspect-mode') },
          '.',
        ],
      },
    ],
  },
  {
    label: 'Testing',
    rows: [
      {
        label: 'On every push',
        text: [
          'GitHub Actions runs Prettier, ESLint, the type checker and the unit tests (Vitest). It also fails if the database migrations don’t match the schema.',
        ],
      },
      {
        label: 'In the browser',
        text: [
          'Playwright opens every page in Chromium, at desktop and phone width. A test fails if axe finds an accessibility issue or if the console shows an error. Firefox and WebKit check one page of each kind.',
        ],
      },
    ],
  },
  {
    label: 'AI agents',
    rows: [
      {
        label: 'How I use them',
        text: [
          'I build this site with Claude Code. My conventions live in the repo as skills, the same ones I use on client projects. So the agent works the way I do, and the tests above catch it when it doesn’t. The design decisions and the final review are mine. I explain how the skills work in ',
          { text: 'Teaching AI agents my house conventions', href: writingPath('teaching-ai-agents-my-conventions') },
          '.',
        ],
      },
    ],
  },
  {
    label: 'Thanks',
    rows: [
      {
        label: 'Open source',
        text: [
          { text: 'Next.js', href: 'https://nextjs.org' },
          ', ',
          { text: 'Payload', href: 'https://payloadcms.com' },
          ', ',
          { text: 'Tailwind CSS', href: 'https://tailwindcss.com' },
          ', ',
          { text: 'Lenis', href: 'https://lenis.darkroom.engineering' },
          ' and ',
          { text: 'Tempus', href: 'https://github.com/darkroomengineering/tempus' },
          ' by darkroom.engineering, ',
          { text: 'GSAP', href: 'https://gsap.com' },
          ' and ',
          { text: 'Lucide', href: 'https://lucide.dev' },
          ' icons. Thank you.',
        ],
      },
    ],
  },
]
