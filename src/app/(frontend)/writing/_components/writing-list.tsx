import { ArrowUpRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { writingPath } from '@/lib/seo/seo.utils'
import { cn, enter, formatMonthDay, groupBy } from '@/lib/utils'

import { LIST_ROW_CLASSNAME } from '@/app/(frontend)/_components/list.const'
import { WRITING_LAST_ENTER_STEP } from './writing.const'
import type { WritingEntry } from './writing.types'

type WritingListProps = {
  /** Newest first. */
  entries: WritingEntry[]
  /** The first row's entrance step, after what comes before it. */
  enterFrom: number
}

/**
 * Every article, newest first, under a label per year: the title (an arrow
 * on hover) and the excerpt, the day on the right. The whole row is the link.
 */
export function WritingList({ entries, enterFrom }: WritingListProps) {
  const years = groupBy(entries, (entry) => String(new Date(entry.publishedAt).getUTCFullYear()))
  let step = enterFrom

  return (
    <div className="flex flex-col gap-pad-xl">
      {years.map(([year, posts]) => (
        <section key={year}>
          <div {...enter(Math.min(step++, WRITING_LAST_ENTER_STEP))}>
            <SectionLabel>{year}</SectionLabel>
          </div>
          <ul className="mt-pad-xs">
            {posts.map((post) => (
              <li key={post.slug} {...enter(Math.min(step++, WRITING_LAST_ENTER_STEP))}>
                <Link href={writingPath(post.slug)} className={cn(LIST_ROW_CLASSNAME, 'flex-col gap-1 sm:flex-row sm:gap-4')}>
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      {post.title}
                      <ArrowUpRight
                        aria-hidden
                        strokeWidth={1.5}
                        className="size-4 shrink-0 text-subtle opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                      />
                    </span>
                    <span className="block text-caption text-pretty text-muted">{post.excerpt}</span>
                  </span>
                  <time dateTime={post.publishedAt} className="font-mono text-micro whitespace-nowrap text-subtle">
                    {formatMonthDay(post.publishedAt)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
