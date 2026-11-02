import type { Payload } from 'payload'

import type { Profile } from '@/payload-types'

/** The shared topics, in the order they read best in a filter. */
const TOPICS = [
  'Design systems',
  'Components',
  'Motion',
  'Accessibility',
  'Performance',
  'AI workflows',
  'CMS',
  'Tooling',
  'Career',
]

/** First day of a month, as the ISO date the month pickers store. */
function month(year: number, monthNumber: number): string {
  return new Date(Date.UTC(year, monthNumber - 1, 1)).toISOString()
}

/** The Profile global: intro and the whole CV, from the ATS CV of 2026-10-30 (no phone number). */
const PROFILE: Omit<Profile, 'id' | 'updatedAt' | 'createdAt'> = {
  name: 'Alejandro Mejía',
  headline: 'Senior Design Engineer',
  intro: 'I build design systems and the interfaces that use them: components, motion, accessibility and performance.',
  available: true,
  availability: ['Design Engineer', 'UX Engineer', 'Frontend Engineer', 'Remote in the EU, UK or US'].join('\n'),
  location: 'Navarra, Spain',
  timezone: 'Europe/Madrid',
  summary: [
    'Design Engineer with 8+ years building production frontends in React, Next.js and TypeScript, and 13+ years on the web. I work where design meets engineering: design systems, component architecture, motion, accessibility and web performance.',
    "I've shipped global ecommerce, SaaS products, high-traffic marketing platforms and award-winning animated websites for teams in Spain, Sweden, the US, the UK, Poland and Argentina. I work closely with designers, product managers and marketers, and I know how a website drives funnels, SEO and conversion.",
    "I'm known for clear communication, mentoring and raising the quality bar of the teams I join.",
  ].join('\n\n'),
  experience: [
    {
      company: 'Desigual',
      companyLocation: 'Barcelona, Spain',
      via: 'Kodly',
      role: 'Design Engineer',
      location: 'Navarra, Spain',
      employment: 'contract',
      remote: true,
      startDate: month(2026, 3),
      summary:
        "Desigual's ecommerce team, evolving the global online store with Vue, SCSS, ISML and Salesforce Commerce Cloud, from Figma designs to production UI.",
      highlights: [
        'Build and evolve reusable UI components that keep the visual language consistent across the global store',
        'Co-design marketer-friendly component structures with SFCC developers, so content teams launch campaigns without developer help',
        'Diagnose and fix production frontend issues while improving code quality and maintainability',
        'Mentor junior developers on component patterns, code review and best practices',
      ].join('\n'),
      stack: ['Vue', 'SCSS', 'ISML', 'Salesforce Commerce Cloud', 'Figma to code'],
    },
    {
      company: 'ChromaWay',
      companyUrl: 'https://chromaway.com',
      companyLocation: 'Sweden',
      role: 'Frontend Developer',
      location: 'Madrid, Spain',
      employment: 'contract',
      remote: true,
      startDate: month(2024, 4),
      endDate: month(2025, 9),
      summary:
        'The marketing team of a Swedish blockchain company, on the content-driven websites chromia.com and chromaway.com.',
      highlights: [
        'Built and maintained scalable, CMS-driven marketing websites with React and Next.js',
        'Led the blog migration from Ghost to in-house hosting: full control over content and lower yearly costs',
        'Improved page speed, SEO structure and frontend consistency across web properties',
        'Turned brand and campaign concepts into polished, production-ready experiences, with marketers and designers',
      ].join('\n'),
      stack: ['React', 'Next.js', 'Technical SEO'],
    },
    {
      company: 'Fieldguide',
      companyLocation: 'United States',
      via: 'BairesDev',
      role: 'Frontend Developer',
      location: 'Medellín, Colombia',
      employment: 'contract',
      remote: true,
      startDate: month(2022, 11),
      endDate: month(2023, 12),
      summary: 'Frontend development on the core product of a SaaS startup.',
      highlights: [
        'Built and improved product features in React and Next.js, partnering closely with the product designer',
        'Kept quality up with Jest unit tests and Cypress end-to-end tests',
        'Built a Chrome extension (Plasmo) that streamlined screenshot capture',
        'Refactored legacy code to modern patterns, improving maintainability and developer velocity',
      ].join('\n'),
      stack: ['React', 'Next.js', 'Jest', 'Cypress', 'Plasmo'],
    },
    {
      company: 'Le Polish Bureau (now UX Machina)',
      companyLocation: 'Poland',
      role: 'Frontend Developer',
      location: 'Medellín, Colombia',
      employment: 'contract',
      remote: true,
      startDate: month(2021, 10),
      endDate: month(2022, 10),
      summary: 'Award-winning, animation-rich websites for international brands.',
      highlights: [
        'Designed and built reusable components documented in Storybook',
        'Built with Next.js, TypeScript, Framer Motion and Styled Components, with motion that supports the story',
        'Integrated Strapi as a headless CMS for flexible content management',
        'Played a key role in a high-impact project for a UK-based international agency',
      ].join('\n'),
      stack: ['Next.js', 'TypeScript', 'Framer Motion', 'Styled Components', 'Storybook', 'Strapi'],
    },
    {
      company: 'Making Sense',
      companyLocation: 'Argentina',
      role: 'UX Developer',
      location: 'Medellín, Colombia',
      remote: true,
      startDate: month(2021, 1),
      endDate: month(2021, 10),
      summary: 'Maintaining and evolving the large-scale design system of an agricultural platform.',
      highlights: [
        'Turned Figma designs into scalable React components',
        'Refactored class components into function components with Hooks',
        'Migrated styling from Sass to Styled Components',
        'Improved responsiveness and usability across the application',
      ].join('\n'),
      stack: ['React', 'Styled Components', 'Figma to code'],
    },
    {
      company: '10Pearls',
      companyLocation: 'Medellín, Colombia',
      role: 'UX Developer',
      startDate: month(2019, 9),
      endDate: month(2021, 1),
      summary: 'Building and maintaining the component library of a U.S.-based educational platform.',
      highlights: [
        'Developed reusable React components for the frontend teams',
        'Proposed and shipped UI improvements for usability and consistency',
        'Worked with international teams across Colombia and the U.S.',
      ].join('\n'),
      stack: ['React'],
    },
    {
      company: 'Integ.ro',
      companyLocation: 'Medellín, Colombia',
      role: 'Web UI Developer',
      startDate: month(2018, 7),
      endDate: month(2019, 9),
      summary: 'A high-profile university website.',
      highlights: [
        'Built responsive, accessible interfaces',
        'Worked with internal teams and stakeholders to meet design and accessibility standards',
      ].join('\n'),
      stack: ['Accessibility (WCAG)'],
    },
    {
      company: 'Interficto SEO',
      companyLocation: 'Medellín, Colombia',
      role: 'Web Designer and Frontend Developer',
      startDate: month(2015, 9),
      endDate: month(2018, 6),
      summary: 'A digital marketing and web agency, working directly with clients.',
      highlights: [
        'Built marketing websites and campaign landing pages focused on lead generation and conversion',
        'Implemented on-page SEO, metadata structure and performance optimizations',
        'Worked directly with clients: requirements, deliverables, and training them to manage their sites',
        'Coordinated a small web design team across projects',
      ].join('\n'),
      stack: ['WordPress', 'Technical SEO'],
    },
  ],
  projects: [
    {
      name: 'Futura77',
      note: 'Independent · private code, walkthrough on request',
      summary:
        'An AI-agent pipeline that takes a site redesign from brief to reviewed pull request, on a motion-rich design system with strict performance budgets.',
      highlights: [
        'Claude Code agents write the design brief and build the redesign, gated by cross-browser rendering, validation, copy lint and Lighthouse checks before a human-reviewed pull request',
        'A design system of tokens, layout primitives and motion components, tested in Chromium, WebKit and Firefox, with reduced-motion and no-JS fallbacks',
        'Performance budgets as hard rules: mobile Lighthouse 95+, CLS 0 and at most 90 KB of JS, with self-hosted variable fonts and an automated image pipeline behind a CDN',
        'A proposal service (Node.js, Fastify, Docker) that renders PDF proposals with Playwright, quoting live PageSpeed scores, with Cloudflare R2 storage and email',
      ].join('\n'),
      stack: ['Claude Code', 'TypeScript', 'Node.js', 'Fastify', 'Playwright', 'Docker', 'Cloudflare R2'],
    },
  ],
  skills: [
    { label: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Vue', 'SCSS', 'Responsive design'] },
    {
      label: 'Design engineering',
      skills: [
        'Design systems',
        'Design tokens',
        'Component architecture',
        'Storybook',
        'Figma to code',
        'Design QA',
        'Accessibility (WCAG)',
      ],
    },
    { label: 'Motion', skills: ['GSAP', 'Framer Motion', 'Lenis', 'Micro-interactions'] },
    { label: 'Quality and performance', skills: ['Core Web Vitals', 'Technical SEO', 'Jest', 'Cypress', 'Playwright'] },
    {
      label: 'CMS and commerce',
      skills: ['Payload', 'Sanity', 'Storyblok', 'Strapi', 'WordPress', 'Salesforce Commerce Cloud', 'ISML'],
    },
    {
      label: 'AI and full stack',
      skills: ['Claude Code', 'Cursor', 'Node.js', 'Fastify', 'REST APIs', 'Docker', 'Cloudflare R2', 'n8n'],
    },
  ],
  education: [
    {
      school: 'Servicio Nacional de Aprendizaje (SENA)',
      degree: 'Technologist in Multimedia Production (web design and development)',
      startYear: 2010,
      endYear: 2012,
    },
  ],
  certifications: [
    { name: 'MERN Fullstack Bootcamp', issuer: 'University of Helsinki' },
    { name: 'Claude Code in Action', issuer: 'Anthropic' },
    { name: 'n8n Course, Levels 1 and 2', issuer: 'n8n' },
    { name: 'Advanced SEO and Web Analytics' },
    { name: 'Git and GitHub' },
  ],
  languages: [
    { language: 'English', level: 'Full professional' },
    { language: 'Spanish', level: 'Native' },
  ],
}

/** The public profiles, for Site settings. */
const SOCIAL_LINKS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/alejandromejiac' },
  { label: 'GitHub', url: 'https://github.com/alejomejia' },
]

/**
 * Topics, the Profile global (from the CV) and the social links. Unless
 * `overwrite` is set, a Profile with content and existing topics are left
 * alone, so it is safe on real content.
 */
export async function seedProfile(payload: Payload, { overwrite = false } = {}) {
  const context = { disableRevalidate: true }

  for (const title of TOPICS) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const { totalDocs } = await payload.count({ collection: 'topics', where: { slug: { equals: slug } } })
    if (totalDocs === 0) await payload.create({ collection: 'topics', context, data: { title, slug } })
  }

  const profile = await payload.findGlobal({ slug: 'profile', depth: 0 })
  if (overwrite || !profile.name) {
    await payload.updateGlobal({ slug: 'profile', context, data: PROFILE })
  }

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  if (overwrite || !settings.socialLinks?.length) {
    await payload.updateGlobal({
      slug: 'site-settings',
      context,
      data: {
        socialLinks: SOCIAL_LINKS.map(({ label, url }) => ({
          link: { type: 'custom' as const, url, label, newTab: true },
        })),
      },
    })
  }

  payload.logger.info('Seed: topics, profile and social links ready')
}
