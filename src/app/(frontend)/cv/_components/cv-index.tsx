'use client'

import { useEffect, useState } from 'react'

import { TextLink } from '@/components/ui/text-link'
import { COPY } from '@/lib/constants/copy'
import { enter } from '@/lib/utils'

import { CvDownload } from './cv-download'

type CvIndexProps = {
  sections: Array<{ id: string; label: string }>
  /** The uploaded PDF; the button stays hidden without one. */
  pdfUrl?: string
  enterStep: number
}

// The band of the viewport that decides the current section: a section is
// current while it crosses the top third, just under the sticky bar.
const CURRENT_BAND = '-15% 0px -70% 0px'

/**
 * The sections as a row of anchors, and the PDF download beside them. It
 * sticks to the top of the viewport, so any section is one click away, and
 * marks the one being read. Screen only.
 */
export function CvIndex({ sections, pdfUrl, enterStep }: CvIndexProps) {
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setCurrent(visible.target.id)
      },
      { rootMargin: CURRENT_BAND },
    )
    for (const { id } of sections) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [sections])

  return (
    <div
      {...enter(
        enterStep,
        'sticky top-0 z-10 flex flex-wrap items-center justify-between gap-x-pad-s gap-y-pad-xs border-b border-foreground/10 bg-background py-pad-s print:hidden',
      )}
    >
      <nav aria-label={COPY.cv.sections}>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <TextLink
                href={`#${id}`}
                aria-current={current === id ? 'location' : undefined}
                className={current === id ? 'text-foreground' : 'text-muted'}
              >
                {label}
              </TextLink>
            </li>
          ))}
        </ul>
      </nav>
      {pdfUrl && <CvDownload href={pdfUrl} label={COPY.cv.download} />}
    </div>
  )
}
