'use client'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Keeps GSAP ScrollTrigger in sync with Lenis. Renders nothing and must live
 * inside the `<Lenis>` (ReactLenis) context; it is mounted automatically by
 * `<Lenis root />`.
 *
 * Updates ScrollTrigger on every Lenis scroll frame, and refreshes it once per
 * route change (coalesced into a single frame) so trigger positions stay
 * correct after the DOM swaps.
 */
export function LenisScrollTriggerSync() {
  const pathname = usePathname()
  const refreshFrame = useRef<number | null>(null)
  const lenis = useLenis(() => ScrollTrigger.update())

  useEffect(() => {
    ScrollTrigger.update()
  }, [])

  useEffect(() => {
    if (!lenis) return

    // Multiple components may request a refresh on route change, so coalesce them
    // into one ScrollTrigger.refresh() on the next frame to avoid repeated
    // layout recalculations.
    if (refreshFrame.current) cancelAnimationFrame(refreshFrame.current)
    refreshFrame.current = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      refreshFrame.current = null
    })

    return () => {
      if (refreshFrame.current) {
        cancelAnimationFrame(refreshFrame.current)
        refreshFrame.current = null
      }
    }
  }, [lenis, pathname])

  return null
}
