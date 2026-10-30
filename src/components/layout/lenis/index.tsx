'use client'

import type { LenisOptions } from 'lenis'
import type { LenisProps as ReactLenisProps, LenisRef } from 'lenis/react'
import { ReactLenis } from 'lenis/react'
import { type ReactNode, useRef } from 'react'
import { useTempus } from 'tempus/react'

import { LenisAutoResize } from './lenis-auto-resize'
import { LenisScrollTriggerSync } from './lenis-scroll-trigger'
import { shouldPreventScroll } from './lenis.utils'

interface LenisProps extends Omit<ReactLenisProps, 'ref'> {
  /** Whether this is the page-level scroll container. When `true`, Lenis drives
   *  window scrolling and GSAP ScrollTrigger sync is wired up automatically. */
  root: boolean
  options?: LenisOptions
  children: ReactNode
}

/**
 * Smooth-scroll wrapper around Lenis, integrated with GSAP ScrollTrigger.
 *
 * Client component. Lenis is advanced from the shared Tempus frame loop (its
 * built-in RAF is disabled via `autoRaf: false`) so it ticks on the same frame
 * as {@link GSAPRuntime}: one `requestAnimationFrame` for the whole app.
 * The root one re-measures the page whenever `<body>` resizes
 * ({@link LenisAutoResize}), so the scroll always reaches the footer. Like
 * every Tempus loop it stops in a hidden tab (`requestAnimationFrame` pauses),
 * so a background tab shows a frozen page until it is visible again.
 *
 * Mount one `<Lenis root>` near the top of the layout. Elements that should
 * keep native scrolling can opt out with the `lenis-prevent` class (see
 * {@link shouldPreventScroll}). Do not import `lenis/dist/lenis.css` or enable
 * `autoToggle`; both cause scrollbar/overflow glitches with this setup.
 *
 * @example
 * ```tsx
 * <Lenis root>
 *   <App />
 * </Lenis>
 * ```
 */
export function Lenis({ root, options, children }: LenisProps) {
  const lenisRef = useRef<LenisRef>(null)

  useTempus(({ time }) => {
    // Lenis.raf expects the current time in ms, which Tempus provides.
    lenisRef.current?.lenis?.raf(time)
  })

  return (
    <ReactLenis
      ref={lenisRef}
      root={root}
      options={{
        ...options,
        lerp: options?.lerp ?? 0.125,
        autoRaf: false,
        anchors: options?.anchors ?? true,
        prevent: options?.prevent ?? shouldPreventScroll,
      }}
    >
      {root && <LenisScrollTriggerSync />}
      {root && <LenisAutoResize />}
      {children}
    </ReactLenis>
  )
}
