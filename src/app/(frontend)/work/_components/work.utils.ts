import { workChapterPath, workPath } from '@/lib/seo/seo.utils'

import type { WorkEntry } from './work.types'

/** A page's place as "02 / 07". */
export function chapterNumber(position: number, total: number): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(position)} / ${pad(total)}`
}

/**
 * The pages of a case study in reading order: the overview (`slug: null`),
 * then each chapter. A one-page case study has only the overview.
 */
export function chapterPages(work: WorkEntry, overviewTitle: string) {
  return [
    { slug: null, title: overviewTitle, summary: work.summary, href: workPath(work.slug) },
    ...(work.chapters ?? []).map((chapter) => ({
      slug: chapter.slug,
      title: chapter.title,
      summary: chapter.summary,
      href: workChapterPath(work.slug, chapter.slug),
    })),
  ]
}
