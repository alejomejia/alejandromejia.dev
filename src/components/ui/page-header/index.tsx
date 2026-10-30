import { cn, enter } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  /** One or two sentences under the title, at `/60`. */
  description?: string
  className?: string
}

/**
 * The top of an inner page: its single `<h1>` and a short description. Both
 * enter first, before the page's own lists (which start at `enter(2)`).
 *
 * @example
 * <PageHeader title="Work" description="Case studies from 13 years on the web." />
 */
export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-pad-xs', className)}>
      <h1 {...enter(0, 'text-display-s font-medium tracking-tight text-balance')}>{title}</h1>
      {description && <p {...enter(1, 'text-pretty text-foreground/60')}>{description}</p>}
    </header>
  )
}
