import type { WorkEntry } from './work.types'

/** The case study with this slug, if there is one. */
export function findWork(slug: string): WorkEntry | undefined {
  return WORK.find((work) => work.slug === slug)
}

/** A chapter of a case study, if there is one with that slug. */
export function findChapter(work: WorkEntry, chapter: string) {
  return work.chapters?.find((entry) => entry.slug === chapter)
}

/** The case study after this one, wrapping around, so a case study never dead-ends. */
export function nextWork(slug: string): WorkEntry {
  const index = WORK.findIndex((work) => work.slug === slug)
  return WORK[(index + 1) % WORK.length]
}

// PLACEHOLDER: the planned case studies (CONTENT-MODEL.md §1), with the facts
// from the Payload seed. Covers come with the recordings; this moves to the
// `work` collection once the pages are signed off.
export const WORK: WorkEntry[] = [
  {
    slug: 'desigual-design-system',
    title: 'Desigual design system',
    summary:
      'A tokens-first component system and Storybook for a global fashion ecommerce, proposed from inside the team.',
    role: 'Design Engineer',
    client: 'Desigual, via Kodly',
    startDate: '2026-03-01',
    stack: ['Vue', 'Storybook', 'SCSS', 'Changesets'],
    featured: true,
    // PLACEHOLDER numbers: replace with real ones before publishing.
    metrics: [
      { value: '1', label: 'Source of design tokens' },
      { value: '40+', label: 'Components documented' },
      { value: '0', label: 'Copies of the handbook' },
    ],
    // PLACEHOLDER story, told in chapters: the approach only, with generic
    // examples (no Desigual brand assets or internal material, see the brand skill).
    content: [
      {
        type: 'paragraph',
        text: 'Several teams build the storefront, and each kept its own copy of the design handbook in code. I proposed, from inside the team, one system they could all build from: design decisions stored once as tokens, components that read only those tokens, and a Storybook other teams use as a product.',
      },
      {
        type: 'clip',
        frame: 'browser',
        private: true,
        caption: 'The Storybook: every component and its states in one place.',
      },
      {
        type: 'paragraph',
        text: 'There were many decisions along the way, so this case study is told in chapters, one per topic. Each ends with a link to the next.',
      },
    ],
    chapters: [
      {
        slug: 'the-problem',
        title: 'The problem',
        summary: 'Copies of the same handbook, drifting apart with every release.',
        content: [
          {
            type: 'paragraph',
            text: 'Colors, spacing and components started the same in every team and drifted apart with every release. Changing a button meant finding every copy of it, and nobody knew which copy was right.',
          },
          {
            type: 'beforeAfter',
            mode: 'slider',
            before: {},
            after: {},
            caption: 'The same component in two teams, before and after the system.',
          },
          {
            type: 'callout',
            kind: 'lesson',
            text: 'Before proposing anything, I listed every copy and how far it had drifted. The list made the case better than any slide.',
          },
        ],
      },
      {
        slug: 'tokens',
        title: 'Tokens first',
        summary: 'Every design decision stored once, and exported for each team.',
        content: [
          {
            type: 'paragraph',
            text: 'Color, type, spacing and motion live in one source. A build step exports them as SCSS and CSS variables, so every team reads the same values in the format it already uses.',
          },
          {
            type: 'code',
            language: 'css',
            filename: 'tokens.css',
            highlight: '2-3',
            code: `:root {
  --color-ink: #111111;
  --color-surface: #fcfcfc;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --radius-control: 0.5rem;
  --motion-quick: 250ms;
}`,
          },
          {
            type: 'callout',
            kind: 'tradeoff',
            text: 'Tokens first is slower at the start: nothing ships until the foundations are agreed. It pays back the first time a brand color changes in one file instead of in every copy.',
          },
        ],
      },
      {
        slug: 'components',
        title: 'Components that read tokens',
        summary: 'No hard-coded values: a design change happens in one file.',
        content: [
          {
            type: 'paragraph',
            text: 'A component never hard-codes a value. It reads the token, so a design change happens in one file and reaches every team on their next upgrade.',
          },
          {
            type: 'code',
            language: 'vue',
            filename: 'base-button.vue',
            highlight: '9-12',
            code: `<template>
  <button class="button" :data-variant="variant">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.button {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-control);
  color: var(--color-ink);
  transition: background-color var(--motion-quick);
}
</style>`,
          },
        ],
      },
      {
        slug: 'storybook',
        title: 'Storybook as a product',
        summary: 'Usage guidance, live code and a changelog for every component.',
        content: [
          {
            type: 'paragraph',
            text: 'A Storybook full of stories nobody reads is a dump. This one is written for the people who use it: when to use a component, its states, its accessibility notes and what changed in each version.',
          },
          {
            type: 'clip',
            frame: 'browser',
            private: true,
            caption: 'A component page: usage, states and live code.',
          },
          {
            type: 'list',
            items: [
              'One page per component, with the same sections in the same order.',
              'Live code next to every example, ready to copy.',
              'A changelog per component, written for the teams that upgrade.',
            ],
          },
        ],
      },
      {
        slug: 'releases',
        title: 'Releases',
        summary: 'Versioned with Changesets, so each team upgrades when it is ready.',
        content: [
          {
            type: 'paragraph',
            text: 'The system ships as a versioned package. Teams upgrade on their own schedule, and every release says what changed and why.',
          },
          {
            type: 'steps',
            items: [
              {
                title: 'Describe the change',
                text: 'Every pull request adds a changeset: what changed, and whether it breaks anything.',
              },
              { title: 'Review', text: 'A designer and an engineer approve it in Storybook before it merges.' },
              { title: 'Release', text: 'Changesets bumps the version and writes the changelog.' },
              { title: 'Upgrade', text: 'Each team upgrades when it is ready, reading the changelog first.' },
            ],
          },
        ],
      },
      {
        slug: 'learnings',
        title: 'What I learned',
        summary: 'What worked, what didn’t, and what is next.',
        content: [
          {
            type: 'paragraph',
            text: 'Teams now build from one set of components, and a design change ships as a release instead of a search through copies. The system is rolling out team by team.',
          },
          {
            type: 'list',
            items: [
              'Proposing from inside the team was slower, but the system was adopted, not imposed.',
              'Documentation decides adoption more than the components do.',
              'Small, frequent releases made upgrades routine instead of a project.',
            ],
          },
        ],
      },
    ],
    retrospective:
      'I would bring the other teams in earlier. The first version was right on paper but answered my own team’s questions first; a short round of interviews would have shaped the documentation sooner.',
  },
  {
    slug: 'arcabuco-website',
    title: 'Arcabuco website',
    summary: 'A creative ecommerce site with signature motion, built on blocks the client edits on their own.',
    role: 'Design Engineer',
    client: 'Arcabuco',
    startDate: '2026-01-01',
    stack: ['Next.js', 'Payload', 'GSAP', 'Tailwind CSS'],
    featured: true,
  },
  {
    slug: 'chromaway-marketing-platforms',
    title: 'ChromaWay marketing platforms',
    summary: 'High-traffic marketing sites for a blockchain company, and moving its blog off Ghost.',
    role: 'Frontend Developer',
    client: 'ChromaWay',
    startDate: '2024-04-01',
    endDate: '2025-09-01',
    stack: ['React', 'Next.js', 'TypeScript'],
    featured: true,
    liveUrl: 'https://chromia.com',
    recommendation: 'michael-kondratenko',
  },
  {
    slug: 'arcabuco-quote-app',
    title: 'Arcabuco quote app',
    summary: 'A conversational quote flow with a live 3D rug preview and a PDF at the end.',
    role: 'Design Engineer',
    client: 'Arcabuco',
    startDate: '2026-01-01',
    stack: ['Next.js', 'React Three Fiber'],
  },
  {
    slug: 'ai-redesign-pipeline',
    title: 'AI redesign pipeline',
    summary:
      'From a lead to a redesigned homepage and a proposal with PageSpeed before and after, reviewed by a human.',
    role: 'Design Engineer',
    startDate: '2025-10-01',
    stack: ['Next.js', 'Playwright', 'Claude Code'],
  },
  {
    slug: 'design-engineering-system',
    title: 'Design engineering system',
    summary: 'A template, conventions and agent skills that people and AI agents follow to build consistent sites.',
    role: 'Design Engineer',
    startDate: '2025-10-01',
    stack: ['Next.js', 'Payload', 'Tailwind CSS', 'Claude Code'],
  },
  {
    slug: 'retrospectiva',
    title: 'Retrospectiva',
    summary: 'A storefront, its admin and multi-channel publishing for my own brand.',
    role: 'Design Engineer',
    startDate: '2025-01-01',
    stack: [],
  },
  {
    slug: 'earlier-work',
    title: 'Earlier work',
    summary: 'Animated sites, design systems and a Chrome extension, 2015–2023.',
    role: 'Frontend Developer',
    startDate: '2015-09-01',
    endDate: '2023-12-01',
    stack: [],
  },
]
