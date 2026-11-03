import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  /** One or two sentences under the title, at `text-muted`. */
  description?: string
  className?: string
}

/**
 * The top of an inner page: its single `<h1>` and a short description.
 *
 * @example
 * <PageHeader title="Work" description="Case studies from 13 years on the web." />
 */
export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-pad-xs', className)}>
      <h1 className="text-display-s font-medium tracking-tight text-balance">{title}</h1>
      {description && <p className="text-pretty text-muted">{description}</p>}
    </header>
  )
}
