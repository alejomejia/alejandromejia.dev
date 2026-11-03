import { CRAFT } from '@/app/(frontend)/craft/_components/craft.mock'
import { WORK } from '@/app/(frontend)/work/_components/work.mock'
import { WRITING } from '@/app/(frontend)/writing/_components/writing.mock'
import { COPY } from '@/lib/constants/copy'
import type { SearchEntry } from '@/lib/cms/search'
import { craftPath, workChapterPath, workPath, writingPath } from '@/lib/seo/seo.utils'

/** Case studies and their chapters (a chapter's case study as its detail). */
function workEntries(): SearchEntry[] {
  return WORK.flatMap((work) => [
    { group: 'work' as const, title: work.title, path: workPath(work.slug) },
    ...(work.chapters ?? []).map((chapter) => ({
      group: 'work' as const,
      title: chapter.title,
      path: workChapterPath(work.slug, chapter.slug),
      detail: work.title,
    })),
  ])
}

/** Articles, newest first. */
function writingEntries(): SearchEntry[] {
  return WRITING.map((entry) => ({ group: 'writing', title: entry.title, path: writingPath(entry.slug) }))
}

/** Experiments and snippets, each with its kind as the detail. */
function craftEntries(): SearchEntry[] {
  return CRAFT.map((entry) => ({
    group: 'craft',
    title: entry.title,
    path: craftPath(entry.slug),
    detail: COPY.craft.kind[entry.kind],
  }))
}

/**
 * `/search.json`: what the command menu searches beyond its own rows, every
 * case study, chapter, article and Craft piece. Read from the same mock data
 * the pages render, so search finds exactly what the site shows; each
 * section moves to the CMS read with its pages. The menu fetches it once per
 * visit, the first time it opens; browsers reuse it for five minutes.
 */
export function GET() {
  const entries = [...workEntries(), ...writingEntries(), ...craftEntries()]
  return Response.json(entries, { headers: { 'Cache-Control': 'public, max-age=300' } })
}
