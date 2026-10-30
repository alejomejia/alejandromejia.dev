import { ArrowUpRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { TextLink } from '@/components/ui/text-link'
import { SITE_ROUTES } from '@/lib/constants/routes'
import type { HomeWork as HomeWorkEntry } from '@/lib/cms/home.server'
import type { Copy } from '@/lib/constants/copy'
import { workPath } from '@/lib/seo/seo.utils'
import { cn, enter, formatYears } from '@/lib/utils'

import { DraftTag } from './draft-tag'
import { LIST_ROW_CLASSNAME } from './list.const'

/**
 * The featured case studies: title and summary, the years on the right, an
 * arrow on hover. Rows enter one after another, after the loop.
 */
export function HomeWork({ entries, copy }: { entries: HomeWorkEntry[]; copy: Copy['home'] }) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel
        aside={
          <TextLink href={SITE_ROUTES.work} variant="underline">
            {copy.allWork}
          </TextLink>
        }
      >
        {copy.work}
      </SectionLabel>
      <ul className="mt-pad-xs">
        {entries.map((work, index) => (
          <li key={work.id} {...enter(1 + index)}>
            <Link href={workPath(work.slug ?? '')} className={cn(LIST_ROW_CLASSNAME, 'flex-col gap-1 sm:flex-row sm:gap-4')}>
              <span className="flex-1">
                <span className="flex items-center gap-2">
                  {work.title}
                  <ArrowUpRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="size-4 text-foreground/40 opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                  />
                  <DraftTag status={work._status} label={copy.draft} />
                </span>
                <span className="block text-caption text-pretty text-foreground/60">{work.summary}</span>
              </span>
              <span className="font-mono text-micro text-foreground/40">{formatYears(work.startDate, work.endDate)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
