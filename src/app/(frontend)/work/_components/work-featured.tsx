import { ArrowUpRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { workPath } from '@/lib/seo/seo.utils'
import { enter, formatYears } from '@/lib/utils'

import { WorkCover } from './work-cover'
import type { WorkEntry } from './work.types'

type WorkFeaturedProps = {
  entries: WorkEntry[]
  label: string
  /** The first entry's entrance step, after what comes before it. */
  enterFrom: number
}

/**
 * The featured case studies, large: the cover, then the title (an arrow on
 * hover) with the years on the right, the summary, and the role and client
 * in mono. The whole entry is the link.
 */
export function WorkFeatured({ entries, label, enterFrom }: WorkFeaturedProps) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <ul className="mt-pad-s flex flex-col gap-pad-xl">
        {entries.map((work, index) => (
          <li key={work.slug} {...enter(enterFrom + index)}>
            <Link href={workPath(work.slug)} className="group flex flex-col gap-pad-s">
              <WorkCover cover={work.cover} />
              <span className="flex flex-col gap-1">
                <span className="flex items-baseline justify-between gap-4">
                  <span className="flex items-center gap-2">
                    {work.title}
                    <ArrowUpRight
                      aria-hidden
                      strokeWidth={1.5}
                      className="size-4 text-subtle opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                    />
                  </span>
                  <span className="font-mono text-micro text-subtle">{formatYears(work.startDate, work.endDate)}</span>
                </span>
                <span className="text-caption text-pretty text-muted">{work.summary}</span>
                <span className="font-mono text-micro text-subtle">
                  {[work.role, work.client].filter(Boolean).join(' · ')}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
