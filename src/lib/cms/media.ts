import type { Media } from '@/payload-types'

/** A Media upload resolved for rendering (and for passing to Client Components). */
export type MediaSource = (
  | {
      type: 'image'
      src: string
      alt: string
      /** The editor's focal point as a CSS `object-position`, so crops keep the subject. */
      position: string
      /** Intrinsic size, for layouts that keep the photo's aspect ratio. Absent on old uploads. */
      width?: number
      height?: number
    }
  | {
      type: 'video'
      src: string
      poster?: string
    }
) & {
  /** The editor's "Load first": the page's LCP element, loaded ahead of the rest. */
  lcp?: boolean
}

/** An image upload resolved for rendering. */
export type ImageSource = Extract<MediaSource, { type: 'image' }>

type UploadValue = Media | number | null | undefined

/**
 * Resolves an upload field holding an image or a video. `null` when it is
 * empty, still an id (read it with `depth >= 1`) or has no URL. `poster` is
 * only used for a video, and defaults to the video's own (its first frame).
 */
export function cmsMediaSource(media: UploadValue, poster?: UploadValue): MediaSource | null {
  if (typeof media !== 'object' || !media?.url) return null

  if (media.mimeType?.startsWith('video/')) {
    // Posters skip `next/image`, so take the 1920px size over a huge original.
    const posterMedia = poster || media.poster
    const posterSrc = typeof posterMedia === 'object' ? posterMedia?.sizes?.xlarge?.url || posterMedia?.url : null
    return { type: 'video', src: media.url, poster: posterSrc || undefined }
  }

  return {
    type: 'image',
    src: media.url,
    alt: media.alt ?? '',
    position: `${media.focalX ?? 50}% ${media.focalY ?? 50}%`,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  }
}

/**
 * Resolves a field built with `image()`. `null` when it is empty, still an
 * id, deleted, or not an image.
 */
export function cmsImage(value: UploadValue): ImageSource | null {
  const source = cmsMediaSource(value)
  return source?.type === 'image' ? source : null
}

/** What `imageOrVideo()` (src/payload/fields/media.ts) stores in a group. */
type ImageOrVideoValue =
  | {
      media?: UploadValue
      poster?: UploadValue
      loadFirst?: boolean | null
    }
  | null
  | undefined

/**
 * Resolves a group built with `imageOrVideo()`, including the editor's
 * "Load first". Render the result with `<CoverMedia>`.
 */
export function cmsImageOrVideo(value: ImageOrVideoValue): MediaSource | null {
  const source = cmsMediaSource(value?.media, value?.poster)
  return source && { ...source, lcp: Boolean(value?.loadFirst) }
}

/**
 * Resolves a field built with `images()` to its images, in the editor's
 * order. Skips the ones that can't be rendered (still an id, deleted, or not
 * an image), so the result can be shorter than the field.
 */
export function cmsImages(value: UploadValue[] | null | undefined): ImageSource[] {
  return (value ?? []).flatMap((media) => cmsImage(media) ?? [])
}
