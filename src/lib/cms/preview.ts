import { documentPath, type RoutableCollection } from '@/lib/seo/seo.utils'

/** Search params the `/next/preview` route expects. */
export type PreviewSearchParams = {
  path: string
  previewSecret: string
}

/**
 * Builds the `/next/preview` URL that enables draft mode and redirects to a
 * document's frontend path.
 * Used by a collection's `admin.livePreview` / `admin.preview` config.
 */
export function generatePreviewPath({
  collection,
  slug,
}: {
  /** The document's collection; its public path decides where the preview opens. */
  collection: RoutableCollection
  slug: string | null | undefined
}): string | null {
  if (!slug) return null

  const path = documentPath(collection, encodeURIComponent(slug))
  const params = new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  return `/next/preview?${params.toString()}`
}
