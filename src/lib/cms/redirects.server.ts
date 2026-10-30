import 'server-only'

import type { CollectionSlug } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import { CMS_CACHE_TAG } from './cms.const'

/** Cached reader for all redirect rules, tagged `redirects`. */
export function getCachedRedirects() {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const { docs } = await payload.find({
        collection: 'redirects',
        depth: 1,
        limit: 0,
        pagination: false,
      })
      return docs
    },
    ['redirects'],
    { tags: ['redirects', CMS_CACHE_TAG] },
  )
}

/** Cached reader for a single document, used to resolve redirect targets. */
export function getCachedDocument(collection: CollectionSlug, id: string | number) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      return payload.findByID({ collection, id })
    },
    [collection, String(id)],
    { tags: [`${collection}_${id}`, CMS_CACHE_TAG] },
  )
}
