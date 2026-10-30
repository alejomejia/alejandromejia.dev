import type { ReactNode } from 'react'

/** One fact; an empty value leaves it out. */
export type PageFact = { label: string; value?: ReactNode }

/**
 * The facts under a page's title, below a hairline (a case study's role and
 * stack, an article's dates): labels in mono at `/40`, values in caption
 * text, two columns on phones and four from `sm`.
 */
export function PageFacts({ facts }: { facts: PageFact[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-pad-s border-t border-foreground/10 pt-pad-s sm:grid-cols-4">
      {facts
        .filter((fact) => fact.value)
        .map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1">
            <dt className="font-mono text-micro text-foreground/40">{fact.label}</dt>
            <dd className="text-caption text-pretty">{fact.value}</dd>
          </div>
        ))}
    </dl>
  )
}
