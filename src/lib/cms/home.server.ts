import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import type { Craft, Work, Writing } from '@/payload-types'

import { CMS_CACHE_TAG } from './cms.const'

/** How many entries each home page list shows. */
// Craft is a sneak peek: one row of two tiles.
const HOME_LIMITS = { work: 4, writing: 4, craft: 2 }

type Status = { _status?: 'draft' | 'published' | null }

export type HomeWork = Pick<Work, 'id' | 'title' | 'slug' | 'summary' | 'startDate' | 'endDate'> & Status
export type HomeWriting = Pick<Writing, 'id' | 'title' | 'slug' | 'publishedAt'> & Status
export type HomeCraft = Pick<Craft, 'id' | 'title' | 'slug' | 'description'> & Status

export type HomeContent = {
  /** Featured case studies, by their order. */
  work: HomeWork[]
  /** The latest articles. */
  writing: HomeWriting[]
  /** The latest experiments. */
  craft: HomeCraft[]
}

async function findHomeContent(draft: boolean): Promise<HomeContent> {
  const payload = await getPayload({ config: configPromise })
  // Drafts need the access override; published reads go through access
  // control (no user), which keeps them to published entries.
  const shared = { draft, overrideAccess: draft, depth: 0, pagination: false } as const

  const [work, writing, craft] = await Promise.all([
    payload.find({
      ...shared,
      collection: 'work',
      where: { featured: { equals: true } },
      sort: 'order',
      limit: HOME_LIMITS.work,
      select: { title: true, slug: true, summary: true, startDate: true, endDate: true, _status: true },
    }),
    payload.find({
      ...shared,
      collection: 'writing',
      sort: '-publishedAt',
      limit: HOME_LIMITS.writing,
      select: { title: true, slug: true, publishedAt: true, _status: true },
    }),
    payload.find({
      ...shared,
      collection: 'craft',
      sort: '-publishedAt',
      limit: HOME_LIMITS.craft,
      select: { title: true, slug: true, description: true, _status: true },
    }),
  ])

  return { work: work.docs, writing: writing.docs, craft: craft.docs }
}

async function findPublishedHomeContent(): Promise<HomeContent> {
  return findHomeContent(false)
}

// Tagged like the other published readers, so any publish refreshes the home page.
const getCachedHomeContent = unstable_cache(findPublishedHomeContent, ['home-content'], {
  tags: [CMS_CACHE_TAG],
})

/**
 * The home page's lists. Published entries only,
 * except in draft mode (Live Preview) and on the dev server, which list
 * drafts too (marked as such), so the page can be judged before anything is
 * published.
 */
export const queryHomeContent = cache(async function queryHomeContent(): Promise<HomeContent> {
  const { isEnabled: draft } = await draftMode()
  const withDrafts = draft || process.env.NODE_ENV === 'development'
  return withDrafts ? findHomeContent(true) : getCachedHomeContent()
})
