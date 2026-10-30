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

/** The Profile global: intro and the whole CV, from the LinkedIn export (no phone number). */
const PROFILE: Omit<Profile, 'id' | 'updatedAt' | 'createdAt'> = {
  name: 'Alejandro Mejía',
  headline: 'Senior Design Engineer',
  intro: 'I build design systems and the interfaces that use them: components, motion, accessibility and performance.',
  available: true,
  availability: 'Open to Design Engineer, UX Engineer and Frontend roles, remote (EU/UK/US)',
  location: 'Navarra, Spain',
  timezone: 'Europe/Madrid',
  summary:
    'Design Engineer with 8+ years building production frontends in React, Next.js and TypeScript, and 13+ years working on the web. I work where design meets engineering: design systems, component architecture, motion and web performance, for global ecommerce, SaaS products, high-traffic marketing platforms and award-winning animated websites.',
  experience: [
    {
      company: 'Kodly',
      role: 'Design Engineer, ecommerce UI and components at Desigual',
      location: 'Navarra, Spain',
      startDate: month(2026, 3),
      summary: "Desigual's ecommerce team, on the global online store: Vue, SCSS, ISML and Salesforce Commerce Cloud.",
      highlights: [
        'Build and evolve reusable UI components that keep the visual language consistent',
        'Co-design marketer-friendly component structures with SFCC developers, so content teams launch campaigns without developer help',
        'Mentor junior developers on component patterns, code review and best practices',
      ].join('\n'),
      stack: ['Vue', 'SCSS', 'ISML', 'Salesforce Commerce Cloud', 'Storybook'],
    },
    {
      company: 'ChromaWay',
      companyUrl: 'https://chromaway.com',
      role: 'Frontend Developer, marketing platforms',
      location: 'Madrid, Spain',
      startDate: month(2024, 4),
      endDate: month(2025, 9),
      summary: 'The marketing team of a Swedish blockchain company, on chromia.com and chromaway.com.',
      highlights: [
        'Built and maintained CMS-driven marketing websites in React and Next.js',
        'Led the blog migration from Ghost to in-house hosting: full control over content and lower yearly costs',
        'Improved page speed, SEO structure and frontend consistency',
      ].join('\n'),
      stack: ['React', 'Next.js', 'TypeScript'],
    },
    {
      company: 'BairesDev',
      role: 'Frontend Developer, SaaS product',
      location: 'Medellín, Colombia',
      startDate: month(2022, 11),
      endDate: month(2023, 12),
      summary: 'A U.S.-based SaaS startup, on the core product experience.',
      highlights: [
        'Built user-facing product features in React and Next.js, with product design',
        'Raised reliability with unit (Jest) and end-to-end (Cypress) tests',
        'Built a Chrome extension (Plasmo) that streamlined screenshot capture for users',
      ].join('\n'),
      stack: ['React', 'Next.js', 'Jest', 'Cypress', 'Plasmo'],
    },
    {
      company: 'Le Polish Bureau',
      role: 'Frontend Developer, interactive web experiences',
      location: 'Medellín, Colombia',
      startDate: month(2021, 10),
      endDate: month(2022, 10),
      summary: 'Award-winning, animation-rich websites for international brands.',
      highlights: [
        'Turned high-fidelity Figma designs into performant Next.js applications',
        'Built component libraries documented in Storybook',
        'Implemented motion and interaction systems with Framer Motion',
      ].join('\n'),
      stack: ['Next.js', 'Storybook', 'Framer Motion', 'Strapi'],
    },
    {
      company: 'Making Sense',
      role: 'UX Developer, design systems',
      location: 'Medellín, Colombia',
      startDate: month(2021, 1),
      endDate: month(2021, 10),
      summary: 'A large-scale agricultural SaaS platform.',
      highlights: [
        'Expanded and maintained a centralized React design system',
        'Modernized the codebase from class components to Hooks, and from Sass to Styled Components',
      ].join('\n'),
      stack: ['React', 'Styled Components'],
    },
    {
      company: '10Pearls',
      role: 'UX Developer, design systems and product UI',
      location: 'Medellín, Colombia',
      startDate: month(2019, 9),
      endDate: month(2021, 1),
      summary: 'A U.S.-based educational SaaS platform.',
      highlights: [
        'Built reusable React components for a shared component library',
        'Standardized UI patterns across teams in Colombia and the U.S.',
      ].join('\n'),
      stack: ['React'],
    },
    {
      company: 'Integ.ro',
      role: 'Web UI Developer',
      location: 'Medellín, Colombia',
      startDate: month(2018, 7),
      endDate: month(2019, 9),
      summary: 'A high-traffic university website.',
      highlights: 'Built responsive, accessible (WCAG) components for content-heavy pages',
    },
    {
      company: 'Interficto SEO',
      role: 'Web Designer and Frontend Developer',
      location: 'Medellín, Colombia',
      startDate: month(2015, 9),
      endDate: month(2018, 6),
      summary: 'A digital marketing and web agency.',
      highlights: [
        'Designed and built WordPress sites and landing pages around conversion goals',
        'Worked directly with clients: requirements, training and delivery',
        'Led a small web design team',
      ].join('\n'),
      stack: ['WordPress', 'SEO'],
    },
    {
      company: 'Sigital',
      role: 'Junior Web Designer → Project Manager → Production Director',
      location: 'Medellín, Colombia',
      startDate: month(2013, 1),
      endDate: month(2015, 5),
    },
  ],
  skills: [
    {
      label: 'Design engineering',
      skills: ['Design systems', 'Component libraries', 'Design tokens', 'Storybook', 'Motion', 'Accessibility (WCAG)'],
    },
    { label: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'Vue', 'Tailwind CSS', 'SCSS', 'GSAP'] },
    { label: 'Performance', skills: ['Core Web Vitals', 'Lighthouse', 'Image and video pipelines'] },
    { label: 'Full stack and AI', skills: ['Node.js', 'Payload CMS', 'Playwright', 'Claude Code agents', 'Jest', 'Cypress'] },
  ],
  education: [
    {
      school: 'Servicio Nacional de Aprendizaje (SENA)',
      degree: 'Technologist in Multimedia Production, web design and development',
      startYear: 2010,
      endYear: 2012,
    },
  ],
  certifications: [
    { name: 'Claude Code in Action', issuer: 'Anthropic' },
    { name: 'Professional Git and GitHub' },
    { name: 'Advanced SEO and Web Analytics' },
    { name: 'MERN Fullstack Bootcamp' },
    { name: 'EF English Certification', issuer: 'EF' },
  ],
  languages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'Full professional' },
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
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
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
        socialLinks: SOCIAL_LINKS.map(({ label, url }) => ({ link: { type: 'custom' as const, url, label, newTab: true } })),
      },
    })
  }

  payload.logger.info('Seed: topics, profile and social links ready')
}
