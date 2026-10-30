import { escapeXML } from '@/lib/utils'

import { SITE } from './seo.const'
import { absoluteURL } from './seo.utils'

/** One entry of the feed: an article or a Craft piece. */
export type FeedItem = {
  title: string
  /** Site-relative path of the entry. */
  path: string
  description: string
  /** ISO date. */
  publishedAt: string
  /** The section and kind first ("Writing", "Craft · Experiment"), then the topics. */
  categories: string[]
}

type RssFeedArgs = {
  /** Site-relative path of the feed itself (its `atom:link` self reference). */
  path: string
  items: FeedItem[]
}

/** An ISO date in RFC 822, the only date format RSS 2.0 accepts. */
function rssDate(iso: string): string {
  return new Date(iso).toUTCString()
}

/**
 * An RSS 2.0 feed of the site: the channel (name, home page, description,
 * language) and the items newest first, each with a permanent link as its
 * `guid`. The `atom:link` self reference is what feed validators expect.
 */
export function rssFeed({ path, items }: RssFeedArgs): string {
  const sorted = [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  const entries = sorted.map((item) => {
    const url = absoluteURL(item.path)
    return [
      '    <item>',
      `      <title>${escapeXML(item.title)}</title>`,
      `      <link>${escapeXML(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXML(url)}</guid>`,
      `      <pubDate>${rssDate(item.publishedAt)}</pubDate>`,
      `      <description>${escapeXML(item.description)}</description>`,
      ...item.categories.map((category) => `      <category>${escapeXML(category)}</category>`),
      '    </item>',
    ].join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXML(SITE.name)}</title>`,
    `    <link>${escapeXML(absoluteURL('/'))}</link>`,
    `    <description>${escapeXML(SITE.description)}</description>`,
    `    <language>${SITE.lang}</language>`,
    sorted[0] && `    <lastBuildDate>${rssDate(sorted[0].publishedAt)}</lastBuildDate>`,
    `    <atom:link href="${escapeXML(absoluteURL(path))}" rel="self" type="application/rss+xml" />`,
    ...entries,
    '  </channel>',
    '</rss>',
    '',
  ]
    .filter(Boolean)
    .join('\n')
}
