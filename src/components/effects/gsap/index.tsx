'use client'

import './gsap.register'

import gsap from 'gsap'
import { useTempus } from 'tempus/react'

/**
 * Drives GSAP's global timeline from the shared Tempus frame loop, so every
 * GSAP animation ticks on the same `requestAnimationFrame` as Lenis instead of
 * GSAP's built-in ticker. Renders nothing.
 *
 * Plugin registration and defaults live in `./gsap.register`.
 * Mount this once, near the root of the tree (see the frontend layout).
 *
 * In a hidden or background tab the browser pauses `requestAnimationFrame`,
 * so every GSAP animation (and Lenis) freezes until
 * the tab is shown again. That is the performance rule working, not a bug;
 * keep it in mind when QA or browser automation looks at a background tab.
 *
 * @example
 * ```tsx
 * // app/(frontend)/layout.tsx
 * <body>
 *   {children}
 *   <GSAPRuntime />
 * </body>
 * ```
 */
export function GSAPRuntime() {
  useTempus(({ time }) => {
    // Tempus reports time in ms; gsap.updateRoot expects seconds.
    gsap.updateRoot(time / 1000)
  })

  return null
}
