import type { Payload } from 'payload'

/** First day of a month, as the ISO date the month pickers store. */
function month(year: number, monthNumber: number): string {
  return new Date(Date.UTC(year, monthNumber - 1, 1)).toISOString()
}

/**
 * The case studies to write, from CONTENT-MODEL.md §1, as drafts with their
 * facts filled in. Covers and bodies are left to write in the admin.
 */
const WORK = [
  {
    slug: 'desigual-design-system',
    title: 'Desigual design system',
    summary: 'A tokens-first component system and Storybook for a global fashion ecommerce, proposed from inside the team.',
    role: 'Design Engineer',
    client: 'Desigual, via Kodly',
    startDate: month(2026, 3),
    stack: ['Vue', 'Storybook', 'SCSS', 'Changesets'],
    featured: true,
    order: 1,
  },
  {
    slug: 'arcabuco-website',
    title: 'Arcabuco website',
    summary: 'A creative ecommerce site with signature motion, built on blocks the client edits on their own.',
    role: 'Design Engineer',
    client: 'Arcabuco',
    startDate: month(2026, 1),
    stack: ['Next.js', 'Payload', 'GSAP', 'Tailwind CSS'],
    featured: true,
    order: 2,
  },
  {
    slug: 'arcabuco-quote-app',
    title: 'Arcabuco quote app',
    summary: 'A conversational quote flow with a live 3D rug preview and a PDF at the end.',
    role: 'Design Engineer',
    client: 'Arcabuco',
    startDate: month(2026, 1),
    stack: ['Next.js', 'React Three Fiber'],
    order: 3,
  },
  {
    slug: 'chromaway-marketing-platforms',
    title: 'ChromaWay marketing platforms',
    summary: 'High-traffic marketing sites for a blockchain company, and moving its blog off Ghost.',
    role: 'Frontend Developer',
    client: 'ChromaWay',
    startDate: month(2024, 4),
    endDate: month(2025, 9),
    stack: ['React', 'Next.js', 'TypeScript'],
    liveUrl: 'https://chromia.com',
    featured: true,
    order: 4,
  },
  {
    slug: 'ai-redesign-pipeline',
    title: 'AI redesign pipeline',
    summary: 'From a lead to a redesigned homepage and a proposal with PageSpeed before and after, reviewed by a human.',
    role: 'Design Engineer',
    startDate: month(2025, 10),
    stack: ['Next.js', 'Playwright', 'Claude Code'],
    order: 5,
  },
  {
    slug: 'design-engineering-system',
    title: 'Design engineering system',
    summary: 'A template, conventions and agent skills that people and AI agents follow to build consistent sites.',
    role: 'Design Engineer',
    startDate: month(2025, 10),
    stack: ['Next.js', 'Payload', 'Tailwind CSS', 'Claude Code'],
    order: 6,
  },
  {
    slug: 'retrospectiva',
    title: 'Retrospectiva',
    summary: 'A storefront, its admin and multi-channel publishing for my own brand.',
    role: 'Design Engineer',
    startDate: month(2025, 1),
    order: 7,
  },
  {
    slug: 'earlier-work',
    title: 'Earlier work',
    summary: 'Animated sites, design systems and a Chrome extension, 2015–2023.',
    role: 'Frontend Developer',
    startDate: month(2015, 9),
    endDate: month(2023, 12),
    order: 8,
  },
]

/** The first articles to write, from CONTENT-MODEL.md §2, as drafts. */
const WRITING = [
  {
    slug: 'showing-nda-work',
    title: 'Muted, looping, private: how I show NDA work',
    excerpt: 'Most of my work is private. Here is how I show it anyway, with short recordings and before/after comparisons.',
  },
  {
    slug: 'teaching-ai-agents-my-conventions',
    title: 'Teaching AI agents my house conventions',
    excerpt: 'Skills and checklists that make agents write code the way the team does.',
  },
  {
    slug: 'storybook-is-a-product',
    title: 'Storybook is a product, not a dump',
    excerpt: 'Treating a component library’s docs as something people choose to use.',
  },
  {
    slug: 'pause-what-you-cant-see',
    title: 'Pause what you can’t see',
    excerpt: 'Performance rules for creative websites: every loop, video and canvas stops off screen.',
  },
  {
    slug: 'migrating-a-blog-off-ghost',
    title: 'Migrating a company blog off Ghost',
    excerpt: 'What it took to move ChromaWay’s blog in-house, and what it saved.',
  },
]

/**
 * Drafts for the case studies and articles planned in CONTENT-MODEL.md, so
 * the admin opens with the work to do. Existing slugs are left alone.
 */
export async function seedDrafts(payload: Payload) {
  const context = { disableRevalidate: true }

  for (const { slug, ...data } of WORK) {
    const { totalDocs } = await payload.count({ collection: 'work', where: { slug: { equals: slug } } })
    if (totalDocs > 0) continue
    // Drafts skip required fields, so the cover and body can wait.
    await payload.create({ collection: 'work', draft: true, context, data: { ...data, slug, _status: 'draft' } })
  }

  for (const { slug, ...data } of WRITING) {
    const { totalDocs } = await payload.count({ collection: 'writing', where: { slug: { equals: slug } } })
    if (totalDocs > 0) continue
    await payload.create({
      collection: 'writing',
      draft: true,
      context,
      data: { ...data, slug, format: 'article', _status: 'draft' },
    })
  }

  payload.logger.info(`Seed: ${WORK.length} case study drafts, ${WRITING.length} article drafts`)
}
