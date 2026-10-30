import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import { craftCard, type OgCard, writingCard } from '@/lib/seo/og/og-cards'

import { CMS_CACHE_TAG } from './cms.const'

async function findShareCard(collection: 'writing' | 'craft', slug: string): Promise<OgCard | null> {
  const payload = await getPayload({ config: configPromise })
  // Published only: no user and `overrideAccess: false`, so a draft never gets a public image.
  const shared = { draft: false, overrideAccess: false, limit: 1, pagination: false, depth: 0 } as const
  const where = { slug: { equals: slug } }

  if (collection === 'writing') {
    const { docs } = await payload.find({
      ...shared,
      collection,
      where,
      select: { title: true, excerpt: true, format: true, meta: { description: true } },
    })
    return docs[0] ? writingCard(docs[0]) : null
  }

  const { docs } = await payload.find({ ...shared, collection, where, select: { title: true, description: true } })
  return docs[0] ? craftCard(docs[0]) : null
}

/**
 * What the share image of a published Writing entry or Craft piece says.
 * Cached under {@link CMS_CACHE_TAG}, which the content hooks expire on change.
 */
export const getShareCard = unstable_cache(findShareCard, ['share-card'], { tags: [CMS_CACHE_TAG] })
