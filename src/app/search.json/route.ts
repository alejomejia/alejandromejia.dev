import { WORK } from '@/app/(frontend)/work/_components/work.mock'
import type { SearchEntry } from '@/lib/cms/search'
import { getSearchEntries } from '@/lib/cms/search.server'
import { workChapterPath, workPath } from '@/lib/seo/seo.utils'

// Rendered per request from the cached CMS read, so the Docker build never
// needs the database.
export const dynamic = 'force-dynamic'

/** Case studies and their chapters. Read from the mock data until Work moves to the CMS. */
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

/**
 * `/search.json`: what the command menu searches beyond its own rows, every
 * published page, case study, chapter and writing entry. The menu fetches it
 * once per visit, the first time it opens; browsers reuse it for five
 * minutes.
 */
export async function GET() {
  const entries = [...(await getSearchEntries()), ...workEntries()]
  return Response.json(entries, { headers: { 'Cache-Control': 'public, max-age=300' } })
}
