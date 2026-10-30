'use client'

import { useEffect, useRef, type VideoHTMLAttributes } from 'react'

import { useInViewport, usePrefersReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'

import { AUTOPLAY_VIDEO_ROOT_MARGIN } from './autoplay-video.const'

type AutoplayVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  'autoPlay' | 'muted' | 'loop' | 'playsInline'
> & {
  src: string
  /** Still frame shown before playback and for reduced-motion users. */
  poster?: string
}

/** `play()` rejects when a quick pause interrupts it, or when the browser
 *  blocks autoplay (e.g. iOS Low Power Mode); both leave the poster up. */
function play(video: HTMLVideoElement) {
  video.play().catch(() => {})
}

/**
 * Muted, looping background video that only plays while it is on screen and
 * pauses the moment it leaves (house performance rule). Reduced-motion users
 * get the poster frame and no playback at all.
 *
 * @example
 * ```tsx
 * <AutoplayVideo src="/clip.mp4" poster="/clip.jpg" className="size-full object-cover" />
 * ```
 */
export function AutoplayVideo({ src, poster, className, preload = 'metadata', ...videoProps }: AutoplayVideoProps) {
  const reducedMotion = usePrefersReducedMotion()
  // The hook's own `inView` ref defaults to `true` (and stays `true` while
  // disabled), so track what the observer actually reported.
  const visible = useRef(false)

  const { ref } = useInViewport<HTMLVideoElement>({
    rootMargin: AUTOPLAY_VIDEO_ROOT_MARGIN,
    disabled: reducedMotion,
    onEnter: () => {
      visible.current = true
      if (ref.current) play(ref.current)
    },
    onLeave: () => {
      visible.current = false
      ref.current?.pause()
    },
  })

  // Disabling the observer only stops future callbacks, so reduced motion
  // (turned on live, or resolved after the first render) pauses here. A new
  // `src` resets the element to paused, so resume it if it is in view.
  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (reducedMotion) {
      visible.current = false
      video.pause()
    } else if (visible.current) {
      play(video)
    }
  }, [reducedMotion, src, ref])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={preload}
      className={cn('block', className)}
      {...videoProps}
    />
  )
}
