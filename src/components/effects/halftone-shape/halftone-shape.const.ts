import type { HalftoneShapeAngles } from './halftone-shape.types'

/** Prop defaults, all overridable. */
export const HALFTONE_SHAPE_DEFAULTS = {
  /** Grid pitch in CSS px: the site's 8px grid. */
  cell: 8,
  /** Rotation and animation speed multiplier. */
  speed: 1,
  /** Largest tilt toward the cursor, in radians (0 turns it off). */
  tilt: 0.5,
  /** Largest dot as a fraction of the cell (1 = neighboring dots touch). */
  dotScale: 0.8,
}

/**
 * The resting angles (`base`), the rotation rates in radians per second at
 * `speed` 1 (`spin`: a slow tumble, so every face and edge catches the light),
 * and the radius of a sphere that always contains the shape (`bound`), which
 * sizes it in the canvas and lets rays that miss it skip the march.
 */
export const HALFTONE_SHAPE_MOTION: { base: HalftoneShapeAngles; spin: HalftoneShapeAngles; bound: number } = {
  base: { x: 0.6, y: 0.8, z: 0 },
  spin: { x: 0.3, y: 0.45, z: 0 },
  bound: 1.08,
}

/**
 * A rounded box whose corner radius goes from almost none (a cube) to half
 * its size (a sphere) and back once per `period` seconds: a radius token
 * being dragged. The box grows a little as it rounds, so the sphere doesn't
 * look like it shrinks.
 */
export const HALFTONE_SHAPE_MORPH = {
  half: { cube: 0.6, sphere: 0.78 },
  radius: { cube: 0.06, sphere: 0.78 },
  period: 8,
} as const

/** Camera distance from the shape's center, in object units. */
export const HALFTONE_SHAPE_CAMERA = 4

/** The bounding sphere's projected radius as a fraction of half the grid's smaller side. */
export const HALFTONE_SHAPE_FIT = 0.95

/** Ray march limits: most steps per ray, the distance that counts as a hit, and the normal's sampling offset. */
export const HALFTONE_SHAPE_MARCH = { steps: 48, hit: 0.002, normal: 0.001 } as const

/** Light direction in view space (upper left, toward the viewer): low enough that each plate shades only part of the one below. Normalized on use. */
export const HALFTONE_SHAPE_LIGHT = { x: -0.6, y: 0.6, z: 0.5 } as const

/** Light every surface gets, even facing away, so shadowed faces keep small dots and the silhouette stays whole. */
export const HALFTONE_SHAPE_AMBIENT = 0.25

/** How much the farthest surface's light drops against the nearest: flat faces get a gradient, which reads as depth. */
export const HALFTONE_SHAPE_DEPTH_FADE = 0.55

/** Cells darker than this stay empty, so the shadow side reads as background grid. */
export const HALFTONE_SHAPE_MIN_LIGHT = 0.04

/** Smallest lit dot as a fraction of the largest, so the faintest cells still read as dots. */
export const HALFTONE_SHAPE_MIN_DOT = 0.12

/** Contrast curve on the light: above 1 darkens the midtones, so only highlights get full-size dots. */
export const HALFTONE_SHAPE_GAMMA = 1.8

/** The background grid: dot radius in CSS px and its opacity. */
export const HALFTONE_SHAPE_GRID = { radius: 0.75, alpha: 0.14 } as const

/** Lerp factor (per 60 fps frame) of the tilt easing toward the cursor. */
export const HALFTONE_SHAPE_TILT_LERP = 0.06

/** Animation time in seconds of the single still frame drawn under reduced motion: halfway between cube and sphere. */
export const HALFTONE_SHAPE_STILL_TIME = 2

/** Longest frame step in ms, so a stalled frame doesn't jump the rotation. */
export const HALFTONE_SHAPE_MAX_DELTA = 50

/** The loop resumes slightly before the canvas scrolls into view. */
export const HALFTONE_SHAPE_ROOT_MARGIN = '15%'
