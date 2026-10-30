import { Image } from '@/components/ui/image'
import { cn } from '@/lib/utils'
import type { Media as MediaResource } from '@/payload-types'

export type MediaProps = {
  /** A populated Media document, or an id/string (unresolved → nothing renders). */
  resource?: MediaResource | string | number | null
  className?: string
  imgClassName?: string
  /** Above-the-fold hero image; see `Image`'s `lcp`. */
  lcp?: boolean
  /** Rendered width per breakpoint. The image is full-width, so this defaults to `100vw`. */
  sizes?: string
}

/**
 * Renders a Payload upload as a responsive image. Only renders when the
 * resource is a populated Media object with a URL.
 */
export function Media({ resource, className, imgClassName, lcp, sizes = '100vw' }: MediaProps) {
  if (!resource || typeof resource !== 'object' || !resource.url) return null

  const { url, alt, width, height } = resource

  return (
    <div className={className}>
      <Image
        src={url}
        alt={alt || ''}
        // Fallback ratio for uploads saved without dimensions (e.g. some SVGs).
        width={width || 1200}
        height={height || 800}
        sizes={sizes}
        lcp={lcp}
        className={cn('h-auto w-full', imgClassName)}
      />
    </div>
  )
}
