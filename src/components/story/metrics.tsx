import { cn } from '@/lib/utils'

import type { MetricsProps } from './story.types'

/** Two to four numbers in a row: the value large, its label under it at `text-muted`. */
export function Metrics({ items, className }: MetricsProps & { className?: string }) {
  return (
    <dl className={cn('grid grid-cols-2 gap-x-4 gap-y-pad-s sm:grid-flow-col sm:auto-cols-fr sm:grid-cols-none', className)}>
      {items.map((metric) => (
        <div key={metric.label} className="flex flex-col-reverse gap-1">
          <dt className="text-caption text-pretty text-muted">{metric.label}</dt>
          <dd className="text-display-s font-medium tracking-tight">{metric.value}</dd>
        </div>
      ))}
    </dl>
  )
}
