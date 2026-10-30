import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Defaults `publishedAt` to now on create/update when the editor left it empty,
 * so ordering and "published on" dates always have a value.
 */
export const populatePublishedAt: CollectionBeforeChangeHook = function populatePublishedAt({
  data,
  operation,
  req,
}) {
  if ((operation === 'create' || operation === 'update') && req.data && !req.data.publishedAt) {
    return { ...data, publishedAt: new Date() }
  }
  return data
}
