'use client'

import { useEffect, useEffectEvent, useRef, type RefObject } from 'react'
import { useTempus } from 'tempus/react'

import { useInViewport, usePrefersReducedMotion } from '@/lib/hooks'
import { clamp, frameLerp } from '@/lib/utils'

import {
  HALFTONE_SHAPE_MAX_DELTA,
  HALFTONE_SHAPE_MOTION,
  HALFTONE_SHAPE_ROOT_MARGIN,
  HALFTONE_SHAPE_STILL_TIME,
  HALFTONE_SHAPE_TILT_LERP,
} from './halftone-shape.const'
import type { HalftoneShapeScene } from './halftone-shape.types'
import { createScene, renderFrame } from './halftone-shape.utils'

type UseHalftoneShapeProps = {
  cell: number
  speed: number
  tilt: number
  dotScale: number
}

/**
 * Runs the shape on the shared Tempus loop: it spins and animates at `speed`,
 * tilts up to `tilt` radians toward the cursor (fine pointers only), and
 * redraws the canvas every frame while it is in view. The scene is rebuilt
 * when the canvas resizes.
 *
 * Paused off screen and in background tabs ({@link useInViewport}). Under
 * reduced motion it draws one still frame and never starts the loop.
 */
export function useHalftoneShape({
  cell,
  speed,
  tilt,
  dotScale,
}: UseHalftoneShapeProps): RefObject<HTMLCanvasElement | null> {
  const reducedMotion = usePrefersReducedMotion()
  const { ref: canvasRef, inView } = useInViewport<HTMLCanvasElement>({
    rootMargin: HALFTONE_SHAPE_ROOT_MARGIN,
    disabled: reducedMotion,
  })
  const scene = useRef<HalftoneShapeScene | null>(null)
  // Animation time in seconds (scaled by speed), the eased tilt, and the cursor
  // position relative to the canvas center (-1 to 1).
  const motion = useRef({ time: HALFTONE_SHAPE_STILL_TIME, tiltX: 0, tiltY: 0, pointerX: 0, pointerY: 0 })

  // Reads the latest dot scale without rebuilding the scene when it changes.
  const drawStill = useEffectEvent(() => {
    if (scene.current) renderFrame(scene.current, HALFTONE_SHAPE_MOTION.base, HALFTONE_SHAPE_STILL_TIME, dotScale)
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function rebuild() {
      scene.current = createScene(canvas!, cell)
      // The loop paints moving frames; a still canvas needs its frame now.
      if (reducedMotion) drawStill()
    }

    // Runs on observe, then on every resize.
    const resizeObserver = new ResizeObserver(rebuild)
    resizeObserver.observe(canvas)

    return () => {
      resizeObserver.disconnect()
      scene.current = null
    }
  }, [canvasRef, cell, reducedMotion])

  // Reduced motion: redraw the still frame when the dot scale is tuned.
  useEffect(() => {
    if (reducedMotion) drawStill()
  }, [reducedMotion, dotScale])

  useEffect(() => {
    // Touch has no hover position to follow, and reduced motion keeps it still.
    if (reducedMotion || tilt === 0 || !window.matchMedia('(pointer: fine)').matches) return
    const state = motion.current

    function onPointerMove(event: PointerEvent) {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      // Relative to the canvas center, normalized by half the viewport, so the
      // shape follows the cursor anywhere on the page.
      state.pointerX = clamp((event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2), -1, 1)
      state.pointerY = clamp((event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2), -1, 1)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      state.pointerX = 0
      state.pointerY = 0
    }
  }, [canvasRef, reducedMotion, tilt])

  useTempus(({ deltaTime }) => {
    const current = scene.current
    if (reducedMotion || !current || !inView.current) return
    const state = motion.current
    const { base, spin } = HALFTONE_SHAPE_MOTION

    state.time += (Math.min(deltaTime, HALFTONE_SHAPE_MAX_DELTA) / 1000) * speed
    // Lerp factors are tuned per 60 fps frame; `frameLerp` rescales them to the real frame time.
    const ease = frameLerp(HALFTONE_SHAPE_TILT_LERP, deltaTime)
    state.tiltX += (state.pointerY * tilt - state.tiltX) * ease
    state.tiltY += (state.pointerX * tilt - state.tiltY) * ease

    const angles = {
      x: base.x + spin.x * state.time + state.tiltX,
      y: base.y + spin.y * state.time + state.tiltY,
      z: base.z + spin.z * state.time,
    }
    renderFrame(current, angles, state.time, dotScale)
  })

  return canvasRef
}
