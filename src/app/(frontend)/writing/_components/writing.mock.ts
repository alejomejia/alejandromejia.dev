import type { WritingEntry } from './writing.types'

/** The article with this slug, if there is one. */
export function findWriting(slug: string): WritingEntry | undefined {
  return WRITING.find((entry) => entry.slug === slug)
}

/** The article after this one (the next older), wrapping around, so an article never dead-ends. */
export function nextWriting(slug: string): WritingEntry {
  const index = WRITING.findIndex((entry) => entry.slug === slug)
  return WRITING[(index + 1) % WRITING.length]
}

// PLACEHOLDER: the planned articles (CONTENT-MODEL.md §2), with the slugs of
// the Payload seed drafts. Dates and bodies are stand-ins to design against;
// related work copies the case studies' titles and summaries the way a
// populated relationship returns them. This moves to the `writing` collection
// once the pages are signed off.
export const WRITING: WritingEntry[] = [
  {
    slug: 'teaching-ai-agents-my-conventions',
    title: 'Teaching AI agents my house conventions',
    excerpt: 'Skills and checklists that make agents write code the way the team does.',
    publishedAt: '2026-10-14',
    topics: ['AI workflows', 'Tooling'],
    relatedWork: [
      {
        slug: 'design-engineering-system',
        title: 'Design engineering system',
        summary: 'A template, conventions and agent skills that people and AI agents follow to build consistent sites.',
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'An agent writes code the way the average repository on the internet does. That is rarely the way my projects do it. I stopped correcting the same habits in every review and started writing them down where the agent reads them first.',
      },
      { type: 'heading', text: 'Rules an agent can check' },
      {
        type: 'paragraph',
        text: 'Prose like “keep spacing consistent” means nothing to a model. “Every value sits on the 8px grid, written in rem” does, and a one-line search proves whether the code follows it. Each rule in my skills ends with the command that checks it.',
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'styling.md',
        code: `# Pixel values in classes: should print nothing
rg -n '\\[[0-9.]+px\\]' src/`,
      },
      { type: 'heading', text: 'One skill per job' },
      {
        type: 'paragraph',
        text: 'A single long instructions file gets skimmed by people and agents alike. I split it by job: code conventions, the brand, the workflow for a new page, commits. Each one loads only when the task needs it.',
      },
      {
        type: 'list',
        items: [
          'The rule first, in one sentence.',
          'Why it exists, in one more.',
          'The check that proves it, as a command.',
        ],
      },
      { type: 'heading', text: 'What still needs a person' },
      {
        type: 'paragraph',
        text: 'Taste. An agent follows the spacing rule perfectly and still picks the wrong section to cut. The conventions free my reviews for the questions only a person can answer.',
      },
    ],
  },
  {
    slug: 'showing-nda-work',
    title: 'Muted, looping, private: how I show NDA work',
    excerpt: 'Most of my work is private. Here is how I show it anyway, with short recordings and before/after comparisons.',
    publishedAt: '2026-09-02',
    updatedAt: '2026-10-20',
    topics: ['Career'],
    relatedWork: [
      {
        slug: 'desigual-design-system',
        title: 'Desigual design system',
        summary: 'A tokens-first component system and Storybook for a global fashion ecommerce, proposed from inside the team.',
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'The best work I have done sits behind logins and contracts. A portfolio of public side projects would hide most of it, so I show the private work in a way that respects the agreements around it.',
      },
      { type: 'heading', text: 'Record the interaction, not the data' },
      {
        type: 'paragraph',
        text: 'A ten second muted loop shows how something moves and responds. It doesn’t need real names, real numbers or the client’s brand. I record against demo data and crop to the part that matters.',
      },
      { type: 'clip', frame: 'browser', private: true, caption: 'A component’s states, recorded against demo data.' },
      { type: 'heading', text: 'Before and after' },
      {
        type: 'paragraph',
        text: 'A comparison makes the change obvious without a paragraph of explanation. I capture the before state first, before touching anything. It can’t be recreated later.',
      },
      {
        type: 'callout',
        kind: 'lesson',
        text: 'Ask for permission early, in writing, and say exactly what you will show. Most teams agree when the answer is “a muted recording of the date picker”.',
      },
    ],
  },
  {
    slug: 'pause-what-you-cant-see',
    title: 'Pause what you can’t see',
    excerpt: 'Performance rules for creative websites: every loop, video and canvas stops off screen.',
    publishedAt: '2026-06-18',
    topics: ['Performance', 'Motion'],
    relatedWork: [
      {
        slug: 'arcabuco-website',
        title: 'Arcabuco website',
        summary: 'A creative ecommerce site with signature motion, built on blocks the client edits on their own.',
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'A creative website runs a lot of work nobody is looking at: a canvas loop at the top of the page, a video three sections down, a timeline waiting in the footer. Each one costs frames, battery and heat. The fix is one rule, applied everywhere.',
      },
      { type: 'heading', text: 'The rule' },
      {
        type: 'paragraph',
        text: 'Any effect that runs per frame or continuously pauses while it is off screen or its tab is hidden. Not as an option a component can turn on: as a requirement of shipping it.',
      },
      { type: 'heading', text: 'One hook for everything' },
      {
        type: 'paragraph',
        text: 'Every effect asks the same question, so one hook answers it. It reports visibility as a ref, so a frame loop can read it without re-rendering, and fires callbacks for things that play and pause, like a video.',
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'loop.tsx',
        highlight: '4,8',
        code: `'use client'

export function Loop() {
  const { ref, inView } = useInViewport<HTMLCanvasElement>()

  useFrame(() => {
    // Skip the work, keep the loop: resuming costs nothing.
    if (!inView.current) return
    draw(ref.current)
  })

  return <canvas ref={ref} />
}`,
      },
      { type: 'heading', text: 'Hidden tabs count too' },
      {
        type: 'paragraph',
        text: 'Browsers already throttle animation frames in a background tab, but timers, videos and audio keep going. The hook treats a hidden tab like an element scrolled away.',
      },
      {
        type: 'callout',
        kind: 'tradeoff',
        text: 'An effect that starts exactly when it enters the viewport can show its first frame late. A small root margin wakes it just before it scrolls in.',
      },
      { type: 'heading', text: 'Animate what the compositor can' },
      {
        type: 'paragraph',
        text: 'Pausing saves the work you can’t see. For the work you can, animate only transform and opacity, so the browser moves layers instead of painting them again.',
      },
      {
        type: 'list',
        items: [
          'Pause every loop, video and timeline off screen.',
          'Write per-frame values through refs, never state.',
          'Run every loop on one shared ticker.',
          'Respect reduced motion with a still frame.',
        ],
      },
    ],
  },
  {
    slug: 'storybook-is-a-product',
    title: 'Storybook is a product, not a dump',
    excerpt: 'Treating a component library’s docs as something people choose to use.',
    publishedAt: '2026-03-11',
    topics: ['Design systems', 'Components'],
    relatedWork: [
      {
        slug: 'desigual-design-system',
        title: 'Desigual design system',
        summary: 'A tokens-first component system and Storybook for a global fashion ecommerce, proposed from inside the team.',
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Most Storybooks are a folder of stories nobody opens twice. A design system lives or dies by whether people choose to use it, and its documentation is where they decide.',
      },
      { type: 'heading', text: 'Write for the reader' },
      {
        type: 'paragraph',
        text: 'Designers want to know when to use a component. Engineers want the props and a snippet to copy. Every page answers both, in the same order, so readers learn where to look.',
      },
      {
        type: 'steps',
        items: [
          { title: 'When to use it', text: 'And when to reach for something else.' },
          { title: 'States', text: 'Every variant, side by side.' },
          { title: 'Accessibility', text: 'Keyboard, focus and screen reader notes.' },
          { title: 'Changelog', text: 'What changed in each version, and why.' },
        ],
      },
      { type: 'heading', text: 'Make it look like the brand' },
      {
        type: 'paragraph',
        text: 'A default Storybook looks like a tool. Restyled with the system’s own tokens, it looks like the handbook designers already know, and they open it without being asked.',
      },
    ],
  },
  {
    slug: 'migrating-a-blog-off-ghost',
    title: 'Migrating a company blog off Ghost',
    excerpt: 'What it took to move ChromaWay’s blog in-house, and what it saved.',
    publishedAt: '2025-11-05',
    topics: ['CMS'],
    relatedWork: [
      {
        slug: 'chromaway-marketing-platforms',
        title: 'ChromaWay marketing platforms',
        summary: 'High-traffic marketing sites for a blockchain company, and moving its blog off Ghost.',
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'The blog lived on its own platform, with its own design and its own deploys. Every change to the marketing site had to be made twice. Moving it in-house meant one codebase, one design system and one place to edit.',
      },
      { type: 'heading', text: 'Keep every URL' },
      {
        type: 'paragraph',
        text: 'Years of posts had links pointing at them. Every old address kept working, either as the same path or as a permanent redirect, checked by a script before launch.',
      },
      { type: 'heading', text: 'Move the content, not the markup' },
      {
        type: 'paragraph',
        text: 'Exported HTML carries the old platform’s quirks with it. Converting posts to structured content first made them render with the new components, and made the next migration easier.',
      },
    ],
  },
]
