import type { ReactNode } from 'react'

import { SectionLabel } from '@/components/ui/section-label'
import { cn } from '@/lib/utils'

type CvSectionProps = {
  /** Its anchor, so the section can be linked (`/cv#experience`). */
  id?: string
  label: string
  aside?: ReactNode
  children: ReactNode
  className?: string
}

/** A CV section: its mono label (the `<h2>`), then its rows. Lands below the sticky index when linked. */
export function CvSection({ id, label, aside, children, className }: CvSectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-pad-3xl', className)}>
      <SectionLabel aside={aside}>{label}</SectionLabel>
      <div className="mt-pad-s">{children}</div>
    </section>
  )
}
