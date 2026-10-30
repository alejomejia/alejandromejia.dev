/**
 * Frame-rate independent lerp factor. `lerp` is tuned per 60 fps frame and
 * rescaled to the real `deltaTime` (ms), so smoothing feels the same on 60,
 * 120 and 144 Hz displays.
 *
 * @example
 * ```ts
 * useTempus(({ deltaTime }) => {
 *   current += (target - current) * frameLerp(0.15, deltaTime)
 * })
 * ```
 */
export function frameLerp(lerp: number, deltaTime: number) {
  return 1 - (1 - lerp) ** (deltaTime / (1000 / 60))
}

/** Limits `value` to the `[min, max]` range. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
