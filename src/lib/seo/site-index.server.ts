import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import { CMS_CACHE_TAG } from '@/lib/cms/cms.const'

import { writingToMarkdown } from './markdown.server'
import { SITE_INDEX_TAG } from './seo.const'
import { writingPath } from './seo.utils'

/** One published, publicly routable document. */
export type SiteIndexEntry = {
  path: string
  title: string
  description?: string
  updatedAt: string
}

async function loadSiteIndex(): Promise<{ writing: SiteIndexEntry[] }> {
  const payload = await getPayload({ config: configPromise })

  // `overrideAccess: false` with no user = the anonymous read access, so only
  // published documents come back (drafts never leak into sitemap/llms.txt).
  const writing = await payload.find({
    collection: 'writing',
    draft: false,
    overrideAccess: false,
    pagination: false,
    depth: 0,
    select: { title: true, slug: true, updatedAt: true, meta: { description: true } },
    sort: '-publishedAt',
  })

  return {
    writing: writing.docs.flatMap((doc): SiteIndexEntry[] =>
      doc.slug
        ? [
            {
              path: writingPath(doc.slug),
              title: doc.title,
              description: doc.meta?.description || undefined,
              updatedAt: doc.updatedAt,
            },
          ]
        : [],
    ),
  }
}

/**
 * Every published Writing entry, for the sitemap and llms.txt. Work and Craft
 * join once their routes read the CMS. Cached under {@link CMS_CACHE_TAG},
 * which the content hooks expire on change.
 */
export const getSiteIndex = unstable_cache(loadSiteIndex, ['site-index'], {
  tags: [SITE_INDEX_TAG, CMS_CACHE_TAG],
})

/** A published document with its full body as Markdown. */
export type SiteContentEntry = SiteIndexEntry & { markdown: string }

async function loadSiteContent(): Promise<{ writing: SiteContentEntry[] }> {
  const payload = await getPayload({ config: configPromise })
  const writing = await payload.find({
    collection: 'writing',
    draft: false,
    overrideAccess: false,
    pagination: false,
    depth: 1,
    sort: '-publishedAt',
  })

  return {
    writing: await Promise.all(
      writing.docs
        .filter((doc) => doc.slug)
        .map(async (doc) => ({
          path: writingPath(doc.slug!),
          title: doc.title,
          description: doc.meta?.description || undefined,
          updatedAt: doc.updatedAt,
          markdown: await writingToMarkdown(doc),
        })),
    ),
  }
}

/** Every published Writing entry with its full content, for `/llms-full.txt`. */
export const getSiteContent = unstable_cache(loadSiteContent, ['site-content'], {
  tags: [SITE_INDEX_TAG, CMS_CACHE_TAG],
})
