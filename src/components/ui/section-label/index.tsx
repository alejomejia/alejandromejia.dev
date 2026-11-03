import type { ReactNode } from 'react'

import { cn, enter } from '@/lib/utils'

/**
 * A section's label: mono micro text at `text-subtle` (sentence case, never
 * uppercase-tracked), with an optional count or link at the end of the row.
 * `enterStep` gives it the brand's entrance, ahead of the rows under it.
 *
 * @example
 * <SectionLabel aside={<TextLink href="/writing">All writing</TextLink>}>Writing</SectionLabel>
 */
export function SectionLabel({
  children,
  aside,
  enterStep,
  className,
}: {
  children: ReactNode
  aside?: ReactNode
  enterStep?: number
  className?: string
}) {
  const classNames = cn('flex items-baseline justify-between gap-4 font-mono text-micro text-subtle', className)

  return (
    <div {...(enterStep === undefined ? { className: classNames } : enter(enterStep, classNames))}>
      <h2>{children}</h2>
      {aside}
    </div>
  )
}
