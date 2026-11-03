/** The channels (0–255) of a `#rgb` or `#rrggbb` color. */
function toRGB(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? [...value].map((digit) => digit + digit).join('') : value
  return [0, 2, 4].map((start) => parseInt(full.slice(start, start + 2), 16)) as [number, number, number]
}

/** Relative luminance (WCAG 2) of a `#rgb` or `#rrggbb` color. */
function luminance(hex: string): number {
  const [r, g, b] = toRGB(hex).map((value) => {
    const channel = value / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * WCAG contrast ratio between two hex colors, from 1 (same) to 21 (black on white).
 * @example contrastRatio('#000000', '#ffffff') // 21
 */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

/**
 * `from` mixed toward `to` by `amount` (0 keeps `from`, 1 gives `to`), as `#rrggbb`.
 * @example mixColors('#000000', '#ffffff', 0.5) // '#808080'
 */
export function mixColors(from: string, to: string, amount: number): string {
  const [a, b] = [toRGB(from), toRGB(to)]
  return `#${a
    .map((channel, index) =>
      Math.round(channel + (b[index] - channel) * amount)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

/**
 * `color` as it is if it reaches `min` contrast against `background`, else
 * nudged toward white (on a dark background) or black (on a light one)
 * until it does.
 * @example ensureContrast('#758575', '#202020') // a lighter green that reads at 4.5:1
 */
export function ensureContrast(color: string, background: string, min = 4.5): string {
  const target = luminance(background) > 0.18 ? '#000000' : '#ffffff'
  for (let step = 0; step <= 20; step++) {
    const candidate = mixColors(color, target, step / 20)
    if (contrastRatio(candidate, background) >= min) return candidate
  }
  return target
}
