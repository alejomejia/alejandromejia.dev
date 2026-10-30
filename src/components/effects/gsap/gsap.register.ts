import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Centralized GSAP plugin registration and configuration.
 *
 * Side-effect module: import it (`import './gsap.register'`) wherever GSAP is
 * used. Every call below is idempotent, so it needs no once-guard, and
 * without one, edits to this file apply on hot reload. Client-only:
 * registering `useGSAP` wakes GSAP's ticker, which on the server would spin a
 * `setTimeout` loop forever.
 *
 * Frame timing is driven by Tempus via {@link GSAPRuntime}, not GSAP's own
 * ticker, so both GSAP and Lenis tick on a single `requestAnimationFrame`.
 */
if (typeof window !== 'undefined') {
  // `useGSAP` must be registered before any useGSAP() call; ScrollTrigger backs
  // the Lenis scroll sync and is the plugin most projects reach for first.
  gsap.registerPlugin(useGSAP, ScrollTrigger)

  gsap.defaults({ ease: 'none' })

  // Tempus owns the frame loop: disable lag smoothing and detach GSAP's own
  // root tick so GSAPRuntime can drive `gsap.updateRoot` instead.
  gsap.ticker.lagSmoothing(0)
  gsap.ticker.remove(gsap.updateRoot)
}
