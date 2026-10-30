import { AutoplayVideo } from '@/components/ui/autoplay-video'
import { Image } from '@/components/ui/image'
import type { MediaSource } from '@/lib/cms/media'
import { cn, toCSSVars } from '@/lib/utils'

type CoverMediaProps = {
  /** From `cmsImageOrVideo()` or `cmsMediaSource()`. Its `lcp` makes it load first. */
  media: MediaSource
  /** Rendered width per breakpoint (images only). */
  sizes: string
  className?: string
}

/**
 * A CMS image or looping video covering its positioned parent, cropped
 * around the editor's focal point. With `lcp`, the image is the LCP
 * candidate and the video preloads in full.
 *
 * @example
 * <div className="relative aspect-video">
 *   <CoverMedia media={cmsImageOrVideo(block.background)} sizes="100vw" />
 * </div>
 */
export function CoverMedia({ media, sizes, className }: CoverMediaProps) {
  if (media.type === 'video') {
    return (
      <AutoplayVideo
        src={media.src}
        poster={media.poster}
        preload={media.lcp ? 'auto' : undefined}
        className={cn('absolute inset-0 size-full object-cover', className)}
      />
    )
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      lcp={media.lcp}
      className={cn('object-cover object-(--focal-point)', className)}
      style={toCSSVars({ 'focal-point': media.position })}
    />
  )
}
