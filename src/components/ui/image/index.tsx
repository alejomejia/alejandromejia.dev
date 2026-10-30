import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import type { Ref } from 'react'

/** Props shared by both layouts; deprecated `next/image` props are left out. */
type ImageBaseProps = Omit<
  NextImageProps,
  'fill' | 'sizes' | 'width' | 'height' | 'priority' | 'preload' | 'onLoadingComplete'
> & {
  ref?: Ref<HTMLImageElement>
  /**
   * The page's LCP candidate (an above-the-fold hero): loads eagerly at high
   * fetch priority. Use on one image per viewport at most.
   */
  lcp?: boolean
}

/**
 * `fill` must come with `sizes`: without it the browser assumes the image is
 * as wide as the viewport and downloads far more pixels than it shows.
 */
type FillImageProps = ImageBaseProps & {
  fill: true
  sizes: string
  width?: never
  height?: never
}

type SizedImageProps = ImageBaseProps & {
  fill?: false
  /** Needed whenever CSS makes the image responsive (e.g. `w-full`). */
  sizes?: string
  /** Intrinsic size; optional for static imports, which carry their own. */
  width?: NextImageProps['width']
  height?: NextImageProps['height']
}

export type ImageProps = FillImageProps | SizedImageProps

/**
 * The project's image. Use it instead of `next/image`: `fill` requires
 * `sizes`, deprecated props (`priority`, `onLoadingComplete`) are gone, and
 * `lcp` is the one switch for above-the-fold images.
 *
 * @example
 * ```tsx
 * <Image src={hero.src} alt="" fill sizes="100vw" lcp className="object-cover" />
 * <Image src={logo} alt="Logo" className="h-8 w-auto" />
 * ```
 */
export function Image({ lcp = false, loading, fetchPriority, ...imageProps }: ImageProps) {
  return (
    <NextImage
      // Next 16 recommends eager + high priority over `preload` for the LCP image.
      loading={lcp ? 'eager' : loading}
      fetchPriority={lcp ? 'high' : fetchPriority}
      {...imageProps}
    />
  )
}
