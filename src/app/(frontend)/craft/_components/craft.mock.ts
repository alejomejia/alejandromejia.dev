import type { CraftEntry, CraftExperiment, CraftSnippet } from './craft.types'

/** The entry with this slug, if there is one. */
export function findCraft(slug: string): CraftEntry | undefined {
  return CRAFT.find((entry) => entry.slug === slug)
}

/** The next entry of the same kind (the next older), wrapping around, so a Craft page never dead-ends. */
export function nextCraft(entry: CraftEntry): CraftEntry {
  const siblings = CRAFT.filter((other) => other.kind === entry.kind)
  const index = siblings.findIndex((other) => other.slug === entry.slug)
  return siblings[(index + 1) % siblings.length]
}

/** The experiments, newest first. */
export function craftExperiments(): CraftExperiment[] {
  return CRAFT.filter((entry): entry is CraftExperiment => entry.kind === 'experiment')
}

/** The snippets, newest first. */
export function craftSnippets(): CraftSnippet[] {
  return CRAFT.filter((entry): entry is CraftSnippet => entry.kind === 'snippet')
}

// PLACEHOLDER: the planned Craft pieces and the
// snippets that move here from Writing. The code is lifted from this site,
// trimmed; dates and notes are stand-ins to design against. Recordings come
// later. This moves to the `craft` collection once the pages are signed off.
export const CRAFT: CraftEntry[] = [
  {
    kind: 'experiment',
    slug: 'inspect-mode',
    title: 'Inspect mode',
    description:
      'A Figma-like inspector over any page of this site: sizes, padding and the distance between two elements.',
    publishedAt: '2026-10-27',
    topics: ['Design systems', 'Tooling'],
    demo: 'inspect-mode',
    files: [
      {
        filename: 'inspect-mode.utils.ts',
        language: 'ts',
        highlight: '3',
        code: `export function formatLength(px: number): string {
  const rounded = Math.round(px)
  const token = Math.abs(px - rounded) < 0.05 ? SPACING_TOKENS[rounded] : undefined
  return token ? \`\${round(px)} · \${token}\` : \`\${round(px)} · \${round(px / 16)}rem\`
}`,
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Every space on this site is a multiple of 8px. Saying so proves nothing, so I built a way to check it: turn inspect mode on and measure anything, the way a designer would in Figma.',
      },
      {
        type: 'paragraph',
        text: 'A distance that matches a spacing token shows the token’s name next to the pixels. When every label names a token, the system is holding.',
      },
    ],
  },
  {
    kind: 'experiment',
    slug: 'halftone-morph',
    title: 'Halftone morph',
    description: 'A cube rounding into a sphere and back, ray-marched into halftone dots on the 8px grid.',
    publishedAt: '2026-10-20',
    topics: ['Motion', 'Performance'],
    demo: 'halftone-shape',
    files: [
      {
        filename: 'halftone-shape.utils.ts',
        language: 'ts',
        highlight: '4-5',
        code: `function distanceFunction(time: number): DistanceFunction {
  const { half, radius, period } = HALFTONE_SHAPE_MORPH
  // 0 = cube, 1 = sphere; smoothed twice so it rests a moment at each end.
  const wave = 0.5 - 0.5 * Math.cos((TAU * time) / period)
  const mix = wave * wave * (3 - 2 * wave)
  const r = radius.cube + (radius.sphere - radius.cube) * mix
  const inner = half.cube + (half.sphere - half.cube) * mix - r
  return (x, y, z) => boxDistance(x, y, z, inner, inner, inner) - r
}`,
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'It is a corner-radius token being dragged from zero to half the box. Each grid cell casts one ray, and the dot grows with the light the surface catches.',
      },
      {
        type: 'list',
        items: ['Paused off screen and in background tabs.', 'One still frame under reduced motion.'],
      },
    ],
  },
  {
    kind: 'experiment',
    slug: 'before-after-slider',
    title: 'Before and after slider',
    description: 'Two versions of a screen behind one divider, dragged with a pointer, a finger or the arrow keys.',
    publishedAt: '2026-09-15',
    topics: ['Components', 'Accessibility'],
    demo: 'before-after',
    files: [
      {
        filename: 'before-after.tsx',
        language: 'tsx',
        highlight: '3,9',
        code: `<div style={toCSSVars({ position: \`\${position}%\` })} className="relative">
  <Side side={before} />
  <div className="absolute inset-0 [clip-path:inset(0_0_0_var(--position))]">
    <Side side={after} />
  </div>
  <input
    type="range"
    value={position}
    onChange={(event) => setPosition(Number(event.target.value))}
    className="absolute inset-0 opacity-0"
  />
</div>`,
      },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'The control is a native range input stretched invisibly over the frame. Touch, mouse and keyboard work without a line of gesture code, and screen readers announce it as a slider.',
      },
    ],
  },
  {
    kind: 'experiment',
    slug: 'blur-page-transition',
    title: 'Blur page transition',
    description: 'The page content blurs out and the next page rises in, while the sidebar stays still.',
    publishedAt: '2026-07-12',
    topics: ['Motion', 'Performance'],
    files: [
      {
        filename: 'view-transitions.css',
        language: 'css',
        code: `::view-transition-old(.page-out) {
  animation: vt-blur-out var(--vt-duration-out) var(--ease-in-quart) both;
}

::view-transition-new(.page-in) {
  animation: vt-blur-in var(--vt-duration-in) var(--ease-out-quint) var(--vt-delay-in) both;
}`,
      },
    ],
  },
  {
    kind: 'experiment',
    slug: 'hover-to-play-cards',
    title: 'Hover to play cards',
    description: 'Cards that play their recording on hover and rest on a still frame, so a grid of videos stays quiet.',
    publishedAt: '2026-05-04',
    topics: ['Motion', 'Performance'],
  },
  {
    kind: 'snippet',
    slug: 'to-css-vars',
    title: 'toCSSVars()',
    description: 'Pass runtime values to Tailwind through CSS variables instead of inline styles.',
    publishedAt: '2026-10-02',
    topics: ['Tooling'],
    files: [
      {
        filename: 'styles.ts',
        language: 'ts',
        code: `export function toCSSVars(
  vars: Record<string, number | string | null | undefined>,
  unit: 'px' | 'rem' = 'rem',
): CSSProperties {
  return Object.fromEntries(
    Object.entries(vars)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [
        \`--\${key}\`,
        typeof value === 'number' ? \`\${unit === 'rem' ? value / 16 : value}\${unit}\` : value,
      ]),
  ) as CSSProperties
}`,
      },
      {
        filename: 'usage.tsx',
        language: 'tsx',
        highlight: '3',
        code: `<div
  className="bg-(--overlay) opacity-(--overlay-opacity)"
  style={toCSSVars({ overlay: hex, 'overlay-opacity': '0.4' })}
/>`,
      },
    ],
  },
  {
    kind: 'snippet',
    slug: 'cn-with-type-tokens',
    title: 'cn() with custom type tokens',
    description: 'Teach tailwind-merge your text-* size tokens, so it stops dropping the text color.',
    publishedAt: '2026-09-10',
    topics: ['Tooling'],
    files: [
      {
        filename: 'styles.ts',
        language: 'ts',
        highlight: '4',
        code: `const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['micro', 'caption', 'body', 'lead', 'display-s', 'display-m'],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}`,
      },
    ],
  },
  {
    kind: 'snippet',
    slug: 'blur-view-transition',
    title: 'Blur view transition',
    description: 'A blur cross-fade between pages with React’s ViewTransition and a few lines of CSS.',
    publishedAt: '2026-08-14',
    topics: ['Motion'],
    files: [
      {
        filename: 'page-transition.tsx',
        language: 'tsx',
        code: `'use client'

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <ViewTransition key={pathname} enter="page-in" exit="page-out" default="none">
      <main>{children}</main>
    </ViewTransition>
  )
}`,
      },
      {
        filename: 'view-transitions.css',
        language: 'css',
        code: `@keyframes vt-blur-out {
  to {
    opacity: 0;
    filter: blur(0.25rem);
  }
}

@keyframes vt-blur-in {
  from {
    opacity: 0;
    filter: blur(0.25rem);
    translate: 0 0.5rem;
  }
}

::view-transition-old(.page-out) {
  animation: vt-blur-out 300ms var(--ease-in-quart) both;
}

::view-transition-new(.page-in) {
  animation: vt-blur-in 600ms var(--ease-out-quint) 200ms both;
}`,
      },
    ],
  },
  {
    kind: 'snippet',
    slug: 'rg-grid-check',
    title: 'An rg check for the 8px grid',
    description: 'One command that lists every spacing class off the 8px grid, for reviews and agents alike.',
    publishedAt: '2026-07-01',
    topics: ['Tooling', 'AI workflows'],
    files: [
      {
        filename: 'check-grid.sh',
        language: 'bash',
        code: `# Odd or fractional spacing steps (4px multiples that aren't 8px ones): should print nothing
rg -n --pcre2 '(?<![\\w-])-?(p[xytrbl]?|m[xytrbl]?|gap(-[xy])?|size|w|h)-(?!(1|3|0\\.5)\\b)(\\d*[13579]|\\d+\\.\\d+)\\b' src`,
      },
    ],
  },
]
