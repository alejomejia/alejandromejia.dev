'use client'

import { useEffect, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Whether the user asked the OS for reduced motion. `false` on the server and
 * the first client render (avoids a hydration mismatch), then live-updates.
 * For GSAP code prefer `gsap.matchMedia()`; use this for non-GSAP behavior
 * such as video autoplay or custom frame loops.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}
