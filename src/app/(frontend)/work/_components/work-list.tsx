import { ArrowUpRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { workPath } from '@/lib/seo/seo.utils'
import { cn, enter, formatYears } from '@/lib/utils'

import { LIST_ROW_CLASSNAME } from '@/app/(frontend)/_components/list.const'
import type { WorkEntry } from './work.types'

type WorkListProps = {
  entries: WorkEntry[]
  label: string
  /** The first row's entrance step, after what comes before it. */
  enterFrom: number
}

/** The rest of the case studies, as the home page lists them: title and summary, the years on the right. */
export function WorkList({ entries, label, enterFrom }: WorkListProps) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <ul className="mt-pad-xs">
        {entries.map((work, index) => (
          <li key={work.slug} {...enter(enterFrom + index)}>
            <Link href={workPath(work.slug)} className={cn(LIST_ROW_CLASSNAME, 'flex-col gap-1 sm:flex-row sm:gap-4')}>
              <span className="flex-1">
                <span className="flex items-center gap-2">
                  {work.title}
                  <ArrowUpRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="size-4 text-subtle opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                  />
                </span>
                <span className="block text-caption text-pretty text-muted">{work.summary}</span>
              </span>
              <span className="font-mono text-micro text-subtle">{formatYears(work.startDate, work.endDate)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
