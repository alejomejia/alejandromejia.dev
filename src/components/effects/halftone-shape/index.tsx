'use client'

import { cn } from '@/lib/utils'

import { HALFTONE_SHAPE_DEFAULTS } from './halftone-shape.const'
import { useHalftoneShape } from './halftone-shape.hooks'
import type { HalftoneShapeProps } from './halftone-shape.types'

/**
 * A slowly tumbling box that rounds from a cube into a sphere and back (a
 * radius token being dragged), drawn as halftone dots on the 8px grid over a
 * faint dot at every grid point. It tilts toward the cursor and draws in the
 * current text color. The site's one signature loop
 * (see the brand skill): use it once, on the home page.
 *
 * Decorative (`aria-hidden`). The canvas fills its box, so size the box:
 * nothing shifts while it loads. Paused off screen; a single still frame
 * under reduced motion.
 *
 * @example
 * <HalftoneShape className="aspect-square w-full max-w-80" />
 */
export function HalftoneShape({
  className,
  cell = HALFTONE_SHAPE_DEFAULTS.cell,
  speed = HALFTONE_SHAPE_DEFAULTS.speed,
  tilt = HALFTONE_SHAPE_DEFAULTS.tilt,
  dotScale = HALFTONE_SHAPE_DEFAULTS.dotScale,
}: HalftoneShapeProps) {
  const canvasRef = useHalftoneShape({ cell, speed, tilt, dotScale })

  return <canvas ref={canvasRef} aria-hidden className={cn('block size-full text-foreground', className)} />
}

export type { HalftoneShapeProps } from './halftone-shape.types'
