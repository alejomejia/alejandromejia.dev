import {
  HALFTONE_SHAPE_AMBIENT,
  HALFTONE_SHAPE_CAMERA,
  HALFTONE_SHAPE_DEPTH_FADE,
  HALFTONE_SHAPE_FIT,
  HALFTONE_SHAPE_GAMMA,
  HALFTONE_SHAPE_GRID,
  HALFTONE_SHAPE_LIGHT,
  HALFTONE_SHAPE_MARCH,
  HALFTONE_SHAPE_MIN_DOT,
  HALFTONE_SHAPE_MIN_LIGHT,
  HALFTONE_SHAPE_MORPH,
  HALFTONE_SHAPE_MOTION,
} from './halftone-shape.const'
import type { DistanceFunction, HalftoneShapeAngles, HalftoneShapeScene } from './halftone-shape.types'

const TAU = Math.PI * 2

/** Builds the scene for the canvas' current size and color. Returns null when the canvas has no size yet. */
export function createScene(canvas: HTMLCanvasElement, cell: number): HalftoneShapeScene | null {
  const ctx = canvas.getContext('2d')
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  if (!ctx || width === 0 || height === 0) return null

  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const cols = Math.floor(width / cell)
  const rows = Math.floor(height / cell)
  const color = getComputedStyle(canvas).color

  return {
    ctx,
    width,
    height,
    cell,
    cols,
    rows,
    offsetX: (width - cols * cell) / 2,
    offsetY: (height - rows * cell) / 2,
    light: new Float32Array(cols * rows),
    grid: renderGrid({ width, height, dpr, cell, cols, rows, color }),
    color,
  }
}

/**
 * Draws one frame: the background grid, then the shape rotated by `angles`
 * and animated to `time` (seconds) as halftone dots, one per cell, sized by
 * how much light the surface seen through that cell catches.
 *
 * Each cell casts one ray and sphere-traces the shape's distance function.
 * The rotation is applied to the ray instead of the shape, so the distance
 * functions stay in object space and cost no matrix math per step.
 */
export function renderFrame(scene: HalftoneShapeScene, angles: HalftoneShapeAngles, time: number, dotScale: number) {
  const { ctx, width, height, cell, cols, rows, offsetX, offsetY, light, grid, color } = scene
  const { bound } = HALFTONE_SHAPE_MOTION
  const distance = distanceFunction(time)
  const m = rotationMatrix(angles)
  const camera = HALFTONE_SHAPE_CAMERA
  const halfSize = Math.min(cols, rows) / 2
  // Focal length that makes the bounding sphere's silhouette `FIT` of half the grid.
  const focal = (HALFTONE_SHAPE_FIT * Math.sqrt(camera * camera - bound * bound)) / bound

  // Camera and light in object space (the transposed rotation undoes it).
  const originX = camera * m[6]
  const originY = camera * m[7]
  const originZ = camera * m[8]
  const lightLength = Math.hypot(HALFTONE_SHAPE_LIGHT.x, HALFTONE_SHAPE_LIGHT.y, HALFTONE_SHAPE_LIGHT.z)
  const lx = HALFTONE_SHAPE_LIGHT.x / lightLength
  const ly = HALFTONE_SHAPE_LIGHT.y / lightLength
  const lz = HALFTONE_SHAPE_LIGHT.z / lightLength
  const lightX = m[0] * lx + m[3] * ly + m[6] * lz
  const lightY = m[1] * lx + m[4] * ly + m[7] * lz
  const lightZ = m[2] * lx + m[5] * ly + m[8] * lz
  const boundTest = camera * camera - bound * bound
  const h = HALFTONE_SHAPE_MARCH.normal
  const nearest = camera - bound

  for (let row = 0; row < rows; row++) {
    const v = -(row + 0.5 - rows / 2) / halfSize
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col
      light[index] = 0
      const u = (col + 0.5 - cols / 2) / halfSize

      // The cell's ray, rotated into object space.
      let dx = m[0] * u + m[3] * v - m[6] * focal
      let dy = m[1] * u + m[4] * v - m[7] * focal
      let dz = m[2] * u + m[5] * v - m[8] * focal
      const length = Math.hypot(dx, dy, dz)
      dx /= length
      dy /= length
      dz /= length

      // Skip rays that miss the bounding sphere; march only inside it.
      const b = originX * dx + originY * dy + originZ * dz
      const discriminant = b * b - boundTest
      if (discriminant < 0) continue
      const root = Math.sqrt(discriminant)
      const far = -b + root
      let t = Math.max(-b - root, 0)
      let hit = false
      for (let step = 0; step < HALFTONE_SHAPE_MARCH.steps && t < far; step++) {
        const d = distance(originX + dx * t, originY + dy * t, originZ + dz * t)
        if (d < HALFTONE_SHAPE_MARCH.hit) {
          hit = true
          break
        }
        t += d
      }
      if (!hit) continue

      // Surface normal from four distance samples (the tetrahedron trick).
      const px = originX + dx * t
      const py = originY + dy * t
      const pz = originZ + dz * t
      const a = distance(px + h, py - h, pz - h)
      const c = distance(px - h, py - h, pz + h)
      const e = distance(px - h, py + h, pz - h)
      const g = distance(px + h, py + h, pz + h)
      const nx = a - c - e + g
      const ny = -a - c + e + g
      const nz = -a + c - e + g
      const luminance = (nx * lightX + ny * lightY + nz * lightZ) / (Math.hypot(nx, ny, nz) || 1)
      const lit = HALFTONE_SHAPE_AMBIENT + (1 - HALFTONE_SHAPE_AMBIENT) * Math.max(luminance, 0)
      // 0 at the bounding sphere's near side, 1 at its far side.
      const depth = (t - nearest) / (2 * bound)
      light[index] = lit ** HALFTONE_SHAPE_GAMMA * (1 - HALFTONE_SHAPE_DEPTH_FADE * depth)
    }
  }

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(grid, 0, 0, width, height)

  // Every dot in one path and one fill: far cheaper than a fill per dot.
  const maxRadius = (cell / 2) * dotScale
  ctx.beginPath()
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const value = light[row * cols + col]
      if (value < HALFTONE_SHAPE_MIN_LIGHT) continue
      const radius = maxRadius * (HALFTONE_SHAPE_MIN_DOT + (1 - HALFTONE_SHAPE_MIN_DOT) * value)
      const x = offsetX + (col + 0.5) * cell
      const y = offsetY + (row + 0.5) * cell
      ctx.moveTo(x + radius, y)
      ctx.arc(x, y, radius, 0, TAU)
    }
  }
  ctx.fillStyle = color
  ctx.fill()
}

/** The morph's distance function at `time` (seconds). Built once per frame, so per-frame values are precomputed. */
function distanceFunction(time: number): DistanceFunction {
  const { half, radius, period } = HALFTONE_SHAPE_MORPH
  // 0 = cube, 1 = sphere; smoothed twice so it rests a moment at each end.
  const wave = 0.5 - 0.5 * Math.cos((TAU * time) / period)
  const mix = wave * wave * (3 - 2 * wave)
  const r = radius.cube + (radius.sphere - radius.cube) * mix
  const inner = half.cube + (half.sphere - half.cube) * mix - r
  return (x, y, z) => boxDistance(x, y, z, inner, inner, inner) - r
}

/** Exact distance to a box with half sizes `bx`, `by`, `bz` (round it by subtracting a radius). */
function boxDistance(x: number, y: number, z: number, bx: number, by: number, bz: number) {
  const qx = Math.abs(x) - bx
  const qy = Math.abs(y) - by
  const qz = Math.abs(z) - bz
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0)
}

/** Row-major 3×3 rotation, x then y then z: R = Rx · Ry · Rz. */
function rotationMatrix({ x, y, z }: HalftoneShapeAngles) {
  const cx = Math.cos(x)
  const sx = Math.sin(x)
  const cy = Math.cos(y)
  const sy = Math.sin(y)
  const cz = Math.cos(z)
  const sz = Math.sin(z)
  return [
    cy * cz,
    -cy * sz,
    sy,
    sx * sy * cz + cx * sz,
    -sx * sy * sz + cx * cz,
    -sx * cy,
    -cx * sy * cz + sx * sz,
    cx * sy * sz + sx * cz,
    cx * cy,
  ]
}

/** The faint dot at every grid point, drawn once per size and color instead of every frame. */
function renderGrid({
  width,
  height,
  dpr,
  cell,
  cols,
  rows,
  color,
}: {
  width: number
  height: number
  dpr: number
  cell: number
  cols: number
  rows: number
  color: string
}) {
  const grid = document.createElement('canvas')
  grid.width = Math.round(width * dpr)
  grid.height = Math.round(height * dpr)
  const ctx = grid.getContext('2d')
  if (!ctx) return grid

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const offsetX = (width - cols * cell) / 2
  const offsetY = (height - rows * cell) / 2
  ctx.beginPath()
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = offsetX + (col + 0.5) * cell
      const y = offsetY + (row + 0.5) * cell
      ctx.moveTo(x + HALFTONE_SHAPE_GRID.radius, y)
      ctx.arc(x, y, HALFTONE_SHAPE_GRID.radius, 0, TAU)
    }
  }
  ctx.globalAlpha = HALFTONE_SHAPE_GRID.alpha
  ctx.fillStyle = color
  ctx.fill()
  return grid
}
