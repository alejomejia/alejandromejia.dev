import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * A two-column row for short facts (the CV's skills, courses and
 * languages): a mono label at `text-subtle` in the first quarter, the
 * content in the rest. On phones the label sits above.
 */
export function LabelRow({
  label,
  children,
  className,
}: {
  label?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('grid gap-1 sm:grid-cols-4 sm:gap-4', className)}>
      <p className="font-mono text-micro text-subtle sm:pt-1">{label}</p>
      <div className="min-w-0 sm:col-span-3">{children}</div>
    </div>
  )
}
