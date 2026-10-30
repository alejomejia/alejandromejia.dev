import 'server-only'

import type { Config } from '@/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import { CMS_CACHE_TAG } from './cms.const'

type GlobalSlug = keyof Config['globals']

async function getGlobal<T extends GlobalSlug>(slug: T, depth: number): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({ slug, depth })
}

/**
 * Returns a cached reader for a Payload global, tagged `global_<slug>` so the
 * matching revalidate hook can bust it on edit. It also carries the CMS tag:
 * with `depth >= 1` it holds populated documents (e.g. a linked page's slug),
 * which go stale when those documents change.
 * @example const header = await getCachedGlobal('header', 1)()
 */
export function getCachedGlobal<T extends GlobalSlug>(slug: T, depth = 0) {
  return unstable_cache(async () => getGlobal(slug, depth), [slug, String(depth)], {
    tags: [`global_${slug}`, CMS_CACHE_TAG],
  })
}
