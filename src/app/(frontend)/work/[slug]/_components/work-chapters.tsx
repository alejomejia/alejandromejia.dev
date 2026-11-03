import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { cn } from '@/lib/utils'

import type { WorkEntry } from '@/app/(frontend)/work/_components/work.types'
import { chapterNumber, chapterPages } from '@/app/(frontend)/work/_components/work.utils'
import { WORK_CHAPTERS_ID } from './work-chapters.const'

type WorkChaptersProps = {
  work: WorkEntry
  /** The chapter on screen; `null` on the overview. */
  current: string | null
  copy: { chapters: string; overview: string }
}

/**
 * The case study's own menu, on every page of a case study told in
 * chapters: the overview and each chapter, numbered, the current one in
 * ink. Renders nothing for a one-page case study. Once it scrolls away,
 * `WorkChapterBar` takes over.
 */
export function WorkChapters({ work, current, copy }: WorkChaptersProps) {
  if (!work.chapters?.length) return null
  const pages = chapterPages(work, copy.overview)
  const position = pages.findIndex((page) => page.slug === current) + 1

  return (
    <nav id={WORK_CHAPTERS_ID} aria-label={copy.chapters}>
      <SectionLabel aside={chapterNumber(position, pages.length)}>{copy.chapters}</SectionLabel>
      <ol className="mt-pad-xs flex flex-col">
        {pages.map((page, index) => {
          const isCurrent = page.slug === current
          return (
            <li key={page.href}>
              <Link
                href={page.href}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'group -mx-2 flex items-baseline gap-4 rounded-lg px-2 py-1 transition-colors duration-250',
                  isCurrent
                    ? 'pointer-events-none text-foreground'
                    : 'text-muted hover:bg-foreground/3 hover:text-foreground',
                )}
              >
                <span className={cn('font-mono text-micro', isCurrent ? 'text-foreground' : 'text-subtle')}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {page.title}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
