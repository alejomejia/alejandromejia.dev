/** Props of {@link HalftoneShape}. */
export type HalftoneShapeProps = {
  /** Sizes the canvas; it fills its box. Give the box a size (e.g. `size-64`, `aspect-square w-full`). */
  className?: string
  /** Grid pitch in CSS px. Keep it on the 8px grid. */
  cell?: number
  /** Rotation and animation speed multiplier. */
  speed?: number
  /** Largest tilt toward the cursor, in radians (0 turns it off). */
  tilt?: number
  /** Largest dot as a fraction of the cell. */
  dotScale?: number
}

/** Rotation angles in radians around the x, y and z axes, applied in that order. */
export type HalftoneShapeAngles = { x: number; y: number; z: number }

/** Signed distance from a point in object space to the shape's surface (negative inside). */
export type DistanceFunction = (x: number, y: number, z: number) => number

/** Everything the renderer needs for one canvas size, rebuilt on resize and theme change. */
export type HalftoneShapeScene = {
  ctx: CanvasRenderingContext2D
  /** Canvas size in CSS px. */
  width: number
  height: number
  cell: number
  cols: number
  rows: number
  /** Centers the grid in the canvas. */
  offsetX: number
  offsetY: number
  /** Light per cell, 0–1. */
  light: Float32Array
  /** The faint background grid, pre-rendered once. */
  grid: HTMLCanvasElement
  /** Dot color: the canvas' computed `color`. */
  color: string
}
