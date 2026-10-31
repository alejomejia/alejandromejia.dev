import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** One fact; an empty value leaves it out. */
export type PageFact = { label: string; value?: ReactNode }

// Full class names, so Tailwind sees them.
const COLUMNS = {
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
} as const

type PageFactsProps = {
  facts: PageFact[]
  /** Columns from `sm`: 3 gives longer values (the CV's) room to stay on one line. */
  columns?: keyof typeof COLUMNS
}

/**
 * The facts under a page's title, below a hairline (a case study's role and
 * stack, an article's dates): labels in mono at `text-subtle`, values in caption
 * text, two columns on phones and four (or three) from `sm`.
 */
export function PageFacts({ facts, columns = 4 }: PageFactsProps) {
  return (
    <dl className={cn('grid grid-cols-2 gap-x-4 gap-y-pad-s border-t border-foreground/10 pt-pad-s', COLUMNS[columns])}>
      {facts
        .filter((fact) => fact.value)
        .map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1">
            <dt className="font-mono text-micro text-subtle">{fact.label}</dt>
            <dd className="text-caption text-pretty">{fact.value}</dd>
          </div>
        ))}
    </dl>
  )
}
