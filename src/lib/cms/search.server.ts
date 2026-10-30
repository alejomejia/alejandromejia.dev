import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import { COPY } from '@/lib/constants/copy'
import { writingPath } from '@/lib/seo/seo.utils'

import { CMS_CACHE_TAG } from './cms.const'
import type { SearchEntry } from './search'

async function loadSearchEntries(): Promise<SearchEntry[]> {
  const payload = await getPayload({ config: configPromise })

  // No user and `overrideAccess: false`: the anonymous read access, so only
  // published documents are searchable.
  const shared = { draft: false, overrideAccess: false, pagination: false, depth: 0 } as const

  const writing = await payload.find({
    ...shared,
    collection: 'writing',
    select: { title: true, slug: true, format: true },
    sort: '-publishedAt',
  })

  return writing.docs.flatMap((doc): SearchEntry[] =>
    doc.slug
      ? [{ group: 'writing', title: doc.title, path: writingPath(doc.slug), detail: COPY.home.formats[doc.format] }]
      : [],
  )
}

/**
 * Every published Writing entry as command menu search entries. Case studies
 * join from the route until Work moves to the CMS. Cached under
 * {@link CMS_CACHE_TAG}, which the content hooks expire on change.
 */
export const getSearchEntries = unstable_cache(loadSearchEntries, ['search-entries'], { tags: [CMS_CACHE_TAG] })
