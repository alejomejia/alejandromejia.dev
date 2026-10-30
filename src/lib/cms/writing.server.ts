import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import type { Writing } from '@/payload-types'

import { CMS_CACHE_TAG } from './cms.const'

async function findWriting(slug: string, draft: boolean): Promise<Writing | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'writing',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] ?? null
}

async function findPublishedWriting(slug: string): Promise<Writing | null> {
  return findWriting(slug, false)
}

// Tagged like the published-page reader, so publishing expires the entry's page.
const getCachedPublishedWriting = unstable_cache(findPublishedWriting, ['published-writing'], {
  tags: [CMS_CACHE_TAG],
})

/** Fetches a single Writing entry by slug, draft-aware: drafts in draft mode, published otherwise. */
export const queryWritingBySlug = cache(async function queryWritingBySlug(
  slug: string,
): Promise<Writing | null> {
  const { isEnabled: draft } = await draftMode()
  return draft ? findWriting(slug, true) : getCachedPublishedWriting(slug)
})

/**
 * Paginated list of published Writing entries for the archive.
 * Access control (`overrideAccess: false`, no user) restricts results to
 * published docs.
 */
export async function queryPublishedWriting({ page = 1, limit = 9 }: { page?: number; limit?: number } = {}) {
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection: 'writing',
    depth: 1,
    page,
    limit,
    sort: '-publishedAt',
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      format: true,
      excerpt: true,
      topics: true,
      cover: true,
      meta: true,
      publishedAt: true,
    },
  })
}
