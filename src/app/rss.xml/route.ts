import { COPY } from '@/lib/constants/copy'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { rssFeed, type FeedItem } from '@/lib/seo/rss'
import { craftPath, writingPath } from '@/lib/seo/seo.utils'

import { CRAFT } from '@/app/(frontend)/craft/_components/craft.mock'
import { WRITING } from '@/app/(frontend)/writing/_components/writing.mock'

/**
 * `/rss.xml`: an RSS 2.0 feed of the articles and the Craft pieces
 * (experiments and snippets), newest first, so feed readers, bots and
 * newsletters pick up what's new. Linked from the footer, and found by
 * readers through the `alternate` link every page carries. Reads the same
 * mocks as the Writing and Craft pages, so it never disagrees with them;
 * it moves to the CMS with them.
 */
export function GET() {
  const writing: FeedItem[] = WRITING.map((entry) => ({
    title: entry.title,
    path: writingPath(entry.slug),
    description: entry.excerpt,
    publishedAt: entry.publishedAt,
    categories: [COPY.shareCard.writing, ...entry.topics],
  }))

  const craft: FeedItem[] = CRAFT.map((entry) => ({
    title: entry.title,
    path: craftPath(entry.slug),
    description: entry.description,
    publishedAt: entry.publishedAt,
    categories: [
      `${COPY.shareCard.craft} · ${entry.kind === 'experiment' ? COPY.shareCard.experiment : COPY.shareCard.snippet}`,
      ...entry.topics,
    ],
  }))

  return new Response(rssFeed({ path: SITE_ROUTES.rss, items: [...writing, ...craft] }), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
