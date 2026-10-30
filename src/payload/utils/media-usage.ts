import type { CollectionSlug, FlattenedBlock, FlattenedField, GlobalSlug, Payload } from 'payload'

const MEDIA = 'media'
// A scan reads every document, and the Used in field re-renders on each form
// change, so results are shared for a few seconds instead of rescanned.
const CACHE_MS = 10_000

type MediaID = number | string

/** One document (or global) that points at a Media file. */
export type MediaUsage = {
  /** "Case study", "Writing", "Profile and CV"… */
  type: string
  title: string
  adminURL: string
  /** Only the unpublished draft uses it; the live site does not yet. */
  draftOnly: boolean
  /** The source is another Media file (a video using it as its cover). */
  fromMedia: boolean
}

/** Every Media reference in the CMS, by Media id. */
export type MediaUsageIndex = {
  usages: (id: MediaID) => MediaUsage[]
  /**
   * True when a document or global shows the file, directly or as the
   * cover of a video that is itself used. A cover whose only user is an
   * unused video counts as unused, so both go in the same cleanup.
   */
  isUsed: (id: MediaID) => boolean
}

type Source = {
  type: string
  title: string
  adminURL: string
  /** For a Media source, its own id, to resolve covers of used videos. */
  mediaID?: MediaID
}

let cached: { at: number; index: Promise<MediaUsageIndex> } | undefined

/**
 * Scans every collection and global (published versions and latest drafts) for upload and relationship fields pointing at Media,
 * including ones nested in groups, tabs, arrays, blocks and rich text.
 * Old versions are not scanned: restoring one may show an empty image.
 */
export function getMediaUsage(payload: Payload): Promise<MediaUsageIndex> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.index
  const index = scanMediaUsage(payload)
  cached = { at: Date.now(), index }
  // A failed scan must not stay cached.
  index.catch(() => (cached = undefined))
  return index
}

/** A fresh scan, skipping the cache: for checks that must not act on stale data. */
export async function scanMediaUsage(payload: Payload): Promise<MediaUsageIndex> {
  const { config } = payload
  const adminRoute = config.routes.admin
  const blocksBySlug = new Map((config.blocks ?? []).map((block) => [block.slug, block as FlattenedBlock]))

  // Media id → source key → usage. Keyed by source so a document counts once
  // however many fields or versions use the file.
  const found = new Map<MediaID, Map<string, MediaUsage & { mediaID?: MediaID }>>()

  function record(id: MediaID, source: Source, draft: boolean) {
    const key = String(id)
    const bySource = found.get(key) ?? new Map()
    found.set(key, bySource)
    const existing = bySource.get(source.adminURL)
    if (existing) {
      existing.draftOnly &&= draft
      return
    }
    bySource.set(source.adminURL, {
      type: source.type,
      title: source.title,
      adminURL: source.adminURL,
      draftOnly: draft,
      fromMedia: source.mediaID !== undefined,
      mediaID: source.mediaID,
    })
  }

  function titleOf(value: unknown, fallback: string): string {
    return typeof value === 'string' && value ? value : fallback
  }

  const walk = (fields: FlattenedField[], data: unknown, onID: (id: MediaID) => void) =>
    walkFields(fields, data, onID, { blocksBySlug })

  const collections = config.collections.filter(
    // Payload's own collections (locked documents, preferences…) reference
    // documents that are open or configured, not shown on the site.
    (collection) => !collection.slug.startsWith('payload-') && referencesMedia(collection.flattenedFields, blocksBySlug),
  )
  const globals = config.globals.filter((global) => referencesMedia(global.flattenedFields, blocksBySlug))

  await Promise.all([
    ...collections.flatMap((collection) => {
      const type = String(getLabel(collection.labels?.singular) ?? collection.slug)
      const useAsTitle = collection.admin?.useAsTitle
      // The main table holds the published version; drafts live in versions.
      const passes = collection.versions?.drafts ? [false, true] : [false]
      return passes.map(async (draft) => {
        const { docs } = await payload.find({
          collection: collection.slug as CollectionSlug,
          depth: 0,
          draft,
          pagination: false,
          overrideAccess: true,
        })
        for (const doc of docs as unknown as Record<string, unknown>[]) {
          const isMedia = collection.slug === MEDIA
          const source: Source = {
            type,
            title: titleOf(useAsTitle ? doc[useAsTitle] : doc.filename, `${type} ${doc.id}`),
            adminURL: `${adminRoute}/collections/${collection.slug}/${doc.id}`,
            mediaID: isMedia ? (doc.id as MediaID) : undefined,
          }
          // A draft that matches the published version adds nothing new; a
          // published reference is only "draft only" if no published pass saw it.
          walk(collection.flattenedFields, doc, (id) => {
            if (isMedia && String(id) === String(doc.id)) return
            record(id, source, draft && doc._status !== 'published')
          })
        }
      })
    }),
    ...globals.flatMap((global) => {
      const type = String(getLabel(global.label) ?? global.slug)
      const passes = global.versions?.drafts ? [false, true] : [false]
      return passes.map(async (draft) => {
        const doc = await payload.findGlobal({ slug: global.slug as GlobalSlug, depth: 0, draft, overrideAccess: true })
        const source: Source = { type: 'Settings', title: type, adminURL: `${adminRoute}/globals/${global.slug}` }
        walk(global.flattenedFields, doc, (id) => record(id, source, draft && (doc as { _status?: string })._status !== 'published'))
      })
    }),
  ])

  const usages = (id: MediaID): MediaUsage[] =>
    [...(found.get(String(id))?.values() ?? [])].map(({ type, title, adminURL, draftOnly, fromMedia }) => ({
      type,
      title,
      adminURL,
      draftOnly,
      fromMedia,
    }))

  const memo = new Map<string, boolean>()
  function isUsed(id: MediaID, seen = new Set<string>()): boolean {
    const key = String(id)
    if (memo.has(key)) return memo.get(key)!
    // Guards against a cover cycle (a file set as its own video's cover chain).
    if (seen.has(key)) return false
    seen.add(key)
    const used = [...(found.get(key)?.values() ?? [])].some(
      (usage) => usage.mediaID === undefined || isUsed(usage.mediaID, seen),
    )
    memo.set(key, used)
    return used
  }

  return { usages, isUsed }
}

/** Drops the cached scan, e.g. right after deleting files. */
export function clearMediaUsageCache() {
  cached = undefined
}

type WalkContext = {
  blocksBySlug: Map<string, FlattenedBlock>
}

function pointsAtMedia(field: FlattenedField): boolean {
  if (field.type !== 'upload' && field.type !== 'relationship') return false
  return Array.isArray(field.relationTo) ? field.relationTo.includes(MEDIA) : field.relationTo === MEDIA
}

function blocksOf(field: FlattenedField & { type: 'blocks' }, blocksBySlug: Map<string, FlattenedBlock>) {
  const references = (field.blockReferences ?? []).map((block) =>
    typeof block === 'string' ? blocksBySlug.get(block) : block,
  )
  return [...field.blocks, ...references].filter((block): block is FlattenedBlock => Boolean(block))
}

/** Whether any field, at any depth, can hold a Media reference. */
function referencesMedia(fields: FlattenedField[], blocksBySlug: Map<string, FlattenedBlock>, seen = new Set<string>()): boolean {
  return fields.some((field) => {
    if (pointsAtMedia(field) || field.type === 'richText') return true
    if (field.type === 'group' || field.type === 'array' || field.type === 'tab') {
      return referencesMedia(field.flattenedFields, blocksBySlug, seen)
    }
    if (field.type === 'blocks') {
      return blocksOf(field, blocksBySlug).some((block) => {
        // Blocks can nest themselves; each is checked once.
        if (seen.has(block.slug)) return false
        seen.add(block.slug)
        return referencesMedia(block.flattenedFields, blocksBySlug, seen)
      })
    }
    return false
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function walkFields(fields: FlattenedField[], data: unknown, onID: (id: MediaID) => void, context: WalkContext) {
  if (!isRecord(data)) return
  for (const field of fields) {
    if (!('name' in field)) continue
    const value = data[field.name]
    if (value != null) walkValue(field, value, onID, context)
  }
}

function walkValue(field: FlattenedField, value: unknown, onID: (id: MediaID) => void, context: WalkContext) {
  if (pointsAtMedia(field)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      // Polymorphic fields store `{ relationTo, value }`; plain ones the id.
      if (isRecord(item) && 'relationTo' in item) {
        if (item.relationTo === MEDIA) addID(item.value, onID)
      } else {
        addID(item, onID)
      }
    }
    return
  }
  switch (field.type) {
    case 'group':
    case 'tab':
      walkFields(field.flattenedFields, value, onID, context)
      break
    case 'array':
      if (Array.isArray(value)) value.forEach((row) => walkFields(field.flattenedFields, row, onID, context))
      break
    case 'blocks': {
      if (!Array.isArray(value)) break
      const blocks = blocksOf(field, context.blocksBySlug)
      for (const row of value) {
        const block = isRecord(row) ? blocks.find(({ slug }) => slug === row.blockType) : undefined
        if (block) walkFields(block.flattenedFields, row, onID, context)
      }
      break
    }
    case 'richText':
      walkLexical(value, onID)
      break
  }
}

/** Lexical upload nodes: `{ type: 'upload', relationTo: 'media', value }`. */
function walkLexical(node: unknown, onID: (id: MediaID) => void) {
  if (Array.isArray(node)) return node.forEach((child) => walkLexical(child, onID))
  if (!isRecord(node)) return
  if (node.type === 'upload' && node.relationTo === MEDIA) addID(node.value, onID)
  for (const child of Object.values(node)) {
    if (child && typeof child === 'object') walkLexical(child, onID)
  }
}

function addID(value: unknown, onID: (id: MediaID) => void) {
  // Depth 0 gives ids; a populated doc carries its id.
  const id = isRecord(value) ? value.id : value
  if (typeof id === 'number' || (typeof id === 'string' && id)) onID(id)
}

function getLabel(label: unknown): string | undefined {
  if (typeof label === 'string') return label
  if (isRecord(label)) return Object.values(label).find((value): value is string => typeof value === 'string')
  return undefined
}
