import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

import { revalidateTag } from 'next/cache'

import { CMS_CACHE_TAG } from '@/lib/cms/cms.const'
import { submitToIndexNow } from '@/lib/seo/indexnow'

/** Minimal shape every revalidatable document shares (satisfies `TypeWithID`). */
type RevalidatableDoc = {
  id: string | number
  slug?: string | null
  _status?: string | null
}

/**
 * Expires every cached page and CMS read, so the next visit to any page
 * renders the current content. Pages, the sitemap and llms.txt all read
 * through {@link CMS_CACHE_TAG}.
 */
export function revalidateSite(payload: Payload) {
  payload.logger.info('Revalidating site content')
  // `expire: 0` instead of the usual `'max'`: the next visit waits for a fresh
  // render rather than getting the old page once while it regenerates.
  // Relies on the clock fix in src/instrumentation.ts.
  revalidateTag(CMS_CACHE_TAG, { expire: 0 })
}

/**
 * Pings IndexNow without blocking the save: a slow or failing search engine
 * must never hold up an editor.
 */
function pingIndexNow(paths: Promise<string[]>, payload: Payload) {
  paths.then(submitToIndexNow).catch((error) => payload.logger.warn(`IndexNow submit failed: ${error}`))
}

type RevalidateOptions<T> = {
  /**
   * Maps a document slug to its public path, for IndexNow. Gets the document
   * too, and may look up others, for paths that depend on more than the slug
   * (a chapter sits under its case study's slug).
   */
  pathFor: (slug: string, doc: T, payload: Payload) => string | Promise<string>
}

/**
 * Builds `afterChange` + `afterDelete` hooks for a collection whose documents
 * are public pages. Every save except an autosave refreshes the site, and
 * IndexNow gets pinged for the URLs that appeared or went away.
 *
 * Set `req.context.disableRevalidate` to skip (e.g. during seeding).
 * @example buildRevalidateHooks({ pathFor: (slug) => `/${slug}` })
 */
export function buildRevalidateHooks<T extends RevalidatableDoc>({
  pathFor,
}: RevalidateOptions<T>): {
  afterChange: CollectionAfterChangeHook<T>
  afterDelete: CollectionAfterDeleteHook<T>
} {
  // The URLs that appeared or went away with this save.
  async function changedPaths(doc: T, previousDoc: T | undefined, payload: Payload): Promise<string[]> {
    const current = doc._status === 'published' && doc.slug ? await pathFor(doc.slug, doc, payload) : null
    const previous =
      previousDoc?._status === 'published' && previousDoc.slug
        ? await pathFor(previousDoc.slug, previousDoc, payload)
        : null
    // The old URL is gone when the doc was unpublished or its path changed.
    return [current, previous === current ? null : previous].filter((path): path is string => Boolean(path))
  }

  const afterChange: CollectionAfterChangeHook<T> = function afterChange({
    doc,
    operation,
    previousDoc,
    req: { payload, context, query },
  }) {
    if (context.disableRevalidate) return doc
    // Autosave runs on every keystroke and only writes a draft version, so the
    // live page can't have changed. Every other save refreshes: `previousDoc`
    // is the latest version, possibly a draft, so "was it live before?" can't
    // be answered reliably (e.g. unpublishing right after a draft save).
    if (String(query?.autosave) === 'true') return doc
    // A brand-new draft was never live. Skipping it also keeps the admin create
    // view working: with autosave on, Payload creates the draft while rendering
    // /create, and `revalidateTag` throws during a render, which blanks the page.
    if (operation === 'create' && doc._status === 'draft') return doc

    revalidateSite(payload)
    pingIndexNow(changedPaths(doc, previousDoc, payload), payload)

    return doc
  }

  const afterDelete: CollectionAfterDeleteHook<T> = function afterDelete({ doc, req: { payload, context } }) {
    if (!context.disableRevalidate && doc?.slug) {
      revalidateSite(payload)
      pingIndexNow(Promise.all([pathFor(doc.slug, doc, payload)]), payload)
    }
    return doc
  }

  return { afterChange, afterDelete }
}

const revalidateSiteAfterChange: CollectionAfterChangeHook = function revalidateSiteAfterChange({
  doc,
  req: { payload, context },
}) {
  if (!context.disableRevalidate) revalidateSite(payload)
  return doc
}

const revalidateSiteAfterDelete: CollectionAfterDeleteHook = function revalidateSiteAfterDelete({
  doc,
  req: { payload, context },
}) {
  if (!context.disableRevalidate) revalidateSite(payload)
  return doc
}

/**
 * Hooks for collections with no URL of their own that show up inside pages
 * (media, topics, recommendations, redirects): any change refreshes the site.
 * Set `req.context.disableRevalidate` to skip (e.g. during seeding).
 */
export const siteRevalidateHooks = {
  afterChange: [revalidateSiteAfterChange],
  afterDelete: [revalidateSiteAfterDelete],
}
