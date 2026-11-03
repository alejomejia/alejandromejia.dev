import type { MetadataRoute } from 'next'

import { getSiteIndex } from '@/lib/seo/site-index.server'
import { absoluteURL } from '@/lib/seo/seo.utils'

type SitemapRoute = { path: string; lastModified?: string }

// Rendered per request so the Docker build never needs the database. Cheap:
// the data comes from the `site-index` cache, not a query per hit.
export const dynamic = 'force-dynamic'

/**
 * `/sitemap.xml`: every published Page and Writing entry plus the static routes.
 * Refreshed on publish via the `site-index` cache tag; no
 * rebuild needed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { writing } = await getSiteIndex()

  const latestWriting = writing.reduce<string | undefined>(
    (latest, entry) => (!latest || entry.updatedAt > latest ? entry.updatedAt : latest),
    undefined,
  )

  // Code-defined routes that aren't CMS documents. Add new static routes here.
  const staticRoutes: SitemapRoute[] = [
    { path: '/writing', lastModified: latestWriting },
    { path: '/cv' },
    { path: '/how-its-built' },
  ]

  // `changeFrequency`/`priority` are omitted: Google ignores both, and an
  // accurate `lastModified` is the signal that matters.
  return [
    { path: '/' },
    ...writing.map((entry) => ({ path: entry.path, lastModified: entry.updatedAt })),
    ...staticRoutes,
  ].map(({ path, lastModified }) => ({ url: absoluteURL(path), lastModified }))
}
