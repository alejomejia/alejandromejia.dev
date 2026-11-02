import { DeleteObjectsCommand, ListObjectsV2Command, S3Client, type _Object } from '@aws-sdk/client-s3'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { formatFilesize } from 'payload/shared'

import { MEDIA_PREFIX, isR2Configured } from '@/payload/plugins/storage'
import { scanMediaUsage } from '@/payload/utils/media-usage'

/**
 * Cleans up Media in two passes, as a dry run unless `--delete` is passed:
 *
 * 1. Media documents nothing uses (same rule as the admin's "Show unused
 *    files"). Deleted through Payload, which removes each file and its sizes
 *    from R2.
 * 2. R2 objects under this environment's prefix that no Media document points
 *    at: leftovers of database resets, reseeds or failed deletes. Payload can't
 *    see them, so they are deleted straight from the bucket.
 *
 * Run with: pnpm media:prune            (report only)
 *           pnpm media:prune --delete   (delete)
 */

const apply = process.argv.includes('--delete')
// An object this fresh may belong to an upload whose document isn't saved yet.
const MIN_AGE_MS = 60 * 60 * 1000

type StoredMedia = {
  id: number
  filename?: string | null
  prefix?: string | null
  filesize?: number | null
  sizes?: Record<string, { filename?: string | null; filesize?: number | null } | undefined> | null
}

const payload = await getPayload({ config: configPromise })

const { docs } = await payload.find({ collection: 'media', depth: 0, pagination: false, overrideAccess: true })
const media = docs as StoredMedia[]
const usage = await scanMediaUsage(payload)

// Pass 1: unused documents.
const unused = media.filter((doc) => !usage.isUsed(doc.id))
const unusedBytes = unused.reduce(
  (total, doc) =>
    total + (doc.filesize ?? 0) + Object.values(doc.sizes ?? {}).reduce((sum, size) => sum + (size?.filesize ?? 0), 0),
  0,
)
payload.logger.info(`${unused.length} of ${media.length} Media files are unused (${formatFilesize(unusedBytes, 1)})`)
for (const doc of unused) payload.logger.info(`  unused: ${doc.filename} (id ${doc.id})`)

if (apply && unused.length > 0) {
  const result = await payload.delete({
    collection: 'media',
    where: { id: { in: unused.map((doc) => doc.id) } },
    overrideAccess: true,
  })
  payload.logger.info(`Deleted ${result.docs.length} unused Media files`)
  for (const error of result.errors) payload.logger.error(`  could not delete ${error.id}: ${error.message}`)
}

// Pass 2: orphaned R2 objects.
if (!isR2Configured) {
  payload.logger.info('R2 is not configured: skipping the bucket check')
} else if (!MEDIA_PREFIX) {
  payload.logger.error('R2_MEDIA_PREFIX is empty: refusing to scan the whole bucket')
} else {
  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
    forcePathStyle: true,
  })
  const bucket = process.env.R2_BUCKET!

  // Re-read after pass 1: deleted documents no longer protect their objects.
  const { docs: current } = apply
    ? await payload.find({ collection: 'media', depth: 0, pagination: false, overrideAccess: true })
    : { docs: media }
  const keep = new Set(
    (current as StoredMedia[]).flatMap((doc) =>
      [doc.filename, ...Object.values(doc.sizes ?? {}).map((size) => size?.filename)]
        .filter(Boolean)
        .map((filename) => `${doc.prefix || MEDIA_PREFIX}/${filename}`),
    ),
  )

  const objects: _Object[] = []
  let token: string | undefined
  do {
    // The trailing slash keeps `website/cms/prod` from matching `website/cms/prod-old`.
    const page = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: `${MEDIA_PREFIX}/`, ContinuationToken: token }),
    )
    objects.push(...(page.Contents ?? []))
    token = page.NextContinuationToken
  } while (token)

  const cutoff = Date.now() - MIN_AGE_MS
  const orphans = objects.filter(
    (object) =>
      object.Key &&
      // Keys ending in "/" are empty folder markers, not files.
      !object.Key.endsWith('/') &&
      !keep.has(object.Key) &&
      (object.LastModified?.getTime() ?? 0) < cutoff,
  )
  const orphanBytes = orphans.reduce((total, object) => total + (object.Size ?? 0), 0)
  payload.logger.info(
    `${orphans.length} of ${objects.length} objects under ${MEDIA_PREFIX}/ have no Media document (${formatFilesize(orphanBytes, 1)})`,
  )
  for (const object of orphans) payload.logger.info(`  orphan: ${object.Key}`)

  if (apply) {
    // DeleteObjects takes up to 1000 keys per call.
    for (let start = 0; start < orphans.length; start += 1000) {
      const batch = orphans.slice(start, start + 1000)
      const { Errors = [] } = await client.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: batch.map(({ Key }) => ({ Key })), Quiet: true },
        }),
      )
      for (const error of Errors) payload.logger.error(`  could not delete ${error.Key}: ${error.Message}`)
    }
    payload.logger.info(`Deleted ${orphans.length} orphaned objects`)
  }
}

if (!apply) payload.logger.info('Dry run: nothing was deleted. Pass --delete to delete.')
process.exit(0)
