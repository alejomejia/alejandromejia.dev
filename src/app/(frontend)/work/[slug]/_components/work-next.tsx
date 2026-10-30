import type { Copy } from '@/lib/constants/copy'
import { workPath } from '@/lib/seo/seo.utils'
import { formatYears } from '@/lib/utils'

import { nextWork } from '@/app/(frontend)/work/_components/work.mock'
import type { WorkEntry } from '@/app/(frontend)/work/_components/work.types'
import { chapterNumber, chapterPages } from '@/app/(frontend)/work/_components/work.utils'
import { OnwardLink } from '@/app/(frontend)/_components/onward-link'

/**
 * The end of a case study page: the next chapter while there is one, then
 * the next case study.
 */
export function WorkNext({ work, current, copy }: { work: WorkEntry; current: string | null; copy: Copy['work'] }) {
  const pages = chapterPages(work, copy.overview)
  const position = pages.findIndex((page) => page.slug === current) + 1
  const nextChapter = pages[position]

  if (nextChapter) {
    return (
      <OnwardLink
        label={copy.nextChapter}
        href={nextChapter.href}
        title={nextChapter.title}
        summary={nextChapter.summary}
        meta={chapterNumber(position + 1, pages.length)}
      />
    )
  }

  const next = nextWork(work.slug)
  return (
    <OnwardLink
      label={copy.next}
      href={workPath(next.slug)}
      title={next.title}
      summary={next.summary}
      meta={formatYears(next.startDate, next.endDate)}
    />
  )
}
