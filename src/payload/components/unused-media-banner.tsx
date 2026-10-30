import type { BeforeListTableServerProps } from 'payload'
import { formatFilesize } from 'payload/shared'

import { getMediaUsage } from '@/payload/utils/media-usage'

type SizedMedia = {
  id: number
  filesize?: number | null
  sizes?: Record<string, { filesize?: number | null } | undefined> | null
}

/**
 * Above the Media list: how many files nothing uses, and a link that filters
 * the list to them. From there, select all and delete: Payload removes each
 * file and its sizes from storage.
 */
export async function UnusedMediaBanner({ payload, searchParams }: BeforeListTableServerProps) {
  const [usage, { docs }] = await Promise.all([
    getMediaUsage(payload),
    payload.find({
      collection: 'media',
      depth: 0,
      pagination: false,
      select: { filesize: true, sizes: true },
      overrideAccess: true,
    }),
  ])

  const unused = (docs as SizedMedia[]).filter((doc) => !usage.isUsed(doc.id))
  // The original plus every generated size: what deleting them frees.
  const bytes = unused.reduce(
    (total, doc) =>
      total + (doc.filesize ?? 0) + Object.values(doc.sizes ?? {}).reduce((sum, size) => sum + (size?.filesize ?? 0), 0),
    0,
  )

  const listURL = `${payload.config.routes.admin}/collections/media`
  const filterURL = `${listURL}?${unused.map((doc, index) => `where[id][in][${index}]=${doc.id}`).join('&')}&limit=100`
  // The list is filtered to unused files when its query holds that id list.
  // Next may hand the query over raw (`where[id][in][0]`) or parsed.
  const parsed = searchParams?.where as { id?: { in?: unknown } } | undefined
  const filtering =
    Boolean(parsed?.id?.in) || Object.keys(searchParams ?? {}).some((key) => key.startsWith('where[id][in]'))

  if (unused.length === 0) {
    return <div className="unused-media">Every file is used somewhere.</div>
  }

  return (
    <div className="unused-media">
      <span>
        {unused.length} {unused.length === 1 ? 'file is' : 'files are'} not used anywhere ({formatFilesize(bytes, 1)} with
        their sizes).
        {filtering && ' Select them all and delete to remove them from storage.'}
      </span>
      <a className="unused-media__link" href={filtering ? listURL : filterURL}>
        {filtering ? 'Show all files' : 'Show unused files'}
      </a>
    </div>
  )
}
