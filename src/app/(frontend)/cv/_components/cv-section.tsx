import type { ReactNode } from 'react'

import { SectionLabel } from '@/components/ui/section-label'
import { cn, enter } from '@/lib/utils'

type CvSectionProps = {
  /** Its anchor, so the section can be linked (`/cv#experience`). */
  id?: string
  label: string
  aside?: ReactNode
  /** Its entrance step; sections below the fold leave it out (it would play off screen). */
  enterStep?: number
  children: ReactNode
  className?: string
}

/** A CV section: its mono label (the `<h2>`), then its rows. Lands below the sticky index when linked. */
export function CvSection({ id, label, aside, enterStep, children, className }: CvSectionProps) {
  const classNames = cn('scroll-mt-pad-3xl', className)

  return (
    <section id={id} {...(enterStep === undefined ? { className: classNames } : enter(enterStep, classNames))}>
      <SectionLabel aside={aside}>{label}</SectionLabel>
      <div className="mt-pad-s">{children}</div>
    </section>
  )
}
