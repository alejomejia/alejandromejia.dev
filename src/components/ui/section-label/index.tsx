import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * A section's label: mono micro text at `text-subtle` (sentence case, never
 * uppercase-tracked), with an optional count or link at the end of the row.
 *
 * @example
 * <SectionLabel aside={<TextLink href="/writing">All writing</TextLink>}>Writing</SectionLabel>
 */
export function SectionLabel({ children, aside, className }: { children: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 font-mono text-micro text-subtle', className)}>
      <h2>{children}</h2>
      {aside}
    </div>
  )
}
