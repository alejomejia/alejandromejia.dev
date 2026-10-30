import { APIError, type CollectionAfterDeleteHook, type CollectionBeforeDeleteHook } from 'payload'

import { clearMediaUsageCache, scanMediaUsage, type MediaUsageIndex } from '@/payload/utils/media-usage'

// `req.context` key holding the scan, so a bulk delete scans once, not per file.
const USAGE_SCAN = 'mediaUsageScan'

/**
 * Refuses to delete a Media file that is still shown somewhere: Postgres would
 * empty the field silently, leaving pages with a missing image. Remove it from
 * those documents first. Run with `context: { forceMediaDelete: true }` to skip.
 */
export const guardMediaDelete: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (req.context.forceMediaDelete) return
  req.context[USAGE_SCAN] ??= scanMediaUsage(req.payload)
  const usage = await (req.context[USAGE_SCAN] as Promise<MediaUsageIndex>)
  if (!usage.isUsed(id)) return

  const places = usage
    .usages(id)
    .map(({ type, title }) => `${title} (${type})`)
    .join(', ')
  throw new APIError(`This file is still used in: ${places}. Remove it there first, then delete it.`, 409, null, true)
}

/** The usage list is cached for a few seconds; a deleted file must leave it now. */
export const clearMediaUsageAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  clearMediaUsageCache()
  return doc
}
