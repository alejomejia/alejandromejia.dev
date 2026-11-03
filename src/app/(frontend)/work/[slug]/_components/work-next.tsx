import type { Copy } from '@/lib/constants/copy'
import { workPath } from '@/lib/seo/seo.utils'
import { formatYears } from '@/lib/utils'

import { nextWork } from '@/app/(frontend)/work/_components/work.mock'
import type { WorkEntry } from '@/app/(frontend)/work/_components/work.types'
import { chapterPages } from '@/app/(frontend)/work/_components/work.utils'
import { OnwardLink } from '@/app/(frontend)/_components/onward-link'
import { WorkPager } from './work-pager'

/**
 * The end of a case study page. A one-page case study leads to the next
 * case study; a chaptered one gets a pager: the previous page and the next
 * chapter, or, after the last chapter, the next case study.
 */
export function WorkNext({ work, current, copy }: { work: WorkEntry; current: string | null; copy: Copy['work'] }) {
  const after = nextWork(work.slug)

  if (!work.chapters?.length) {
    return (
      <OnwardLink
        label={copy.next}
        href={workPath(after.slug)}
        title={after.title}
        summary={after.summary}
        meta={formatYears(after.startDate, after.endDate)}
      />
    )
  }

  const pages = chapterPages(work, copy.overview)
  const position = pages.findIndex((page) => page.slug === current) + 1
  const number = (index: number) => String(index + 1).padStart(2, '0')
  const previous = position > 1 ? pages[position - 2] : null
  const nextChapter = pages[position]

  return (
    <WorkPager
      label={copy.chapterNav}
      previous={
        previous && {
          label: copy.previousChapter,
          href: previous.href,
          title: previous.title,
          meta: number(position - 2),
        }
      }
      next={
        nextChapter
          ? { label: copy.nextChapter, href: nextChapter.href, title: nextChapter.title, meta: number(position) }
          : { label: copy.next, href: workPath(after.slug), title: after.title, meta: '' }
      }
    />
  )
}
