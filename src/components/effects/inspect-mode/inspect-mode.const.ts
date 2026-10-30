/**
 * The overlay's own colors, Figma's: selection blue and redline red, with
 * white labels. The only hues on the site besides the availability dot; they
 * exist only while inspect mode is on.
 */
export const INSPECT_COLORS = {
  'inspect-box': '#0d99ff',
  'inspect-distance': '#f24822',
  'inspect-label': '#ffffff',
}

/** The key that toggles inspect mode (no modifiers, outside text fields). */
export const INSPECT_KEY = 'i'

/** The spacing tokens (`--spacing-pad-*` in theme.css) by their px value, to name a measured distance. */
export const SPACING_TOKENS: Record<number, string> = {
  4: 'pad-xxs',
  8: 'pad-xs',
  16: 'pad-s',
  24: 'pad-m',
  32: 'pad-l',
  48: 'pad-xl',
  64: 'pad-2xl',
  96: 'pad-3xl',
  128: 'pad-4xl',
  192: 'pad-5xl',
  256: 'pad-6xl',
}

/** Marks elements inspect mode leaves alone: its own overlay and controls, the command menu. */
export const INSPECT_IGNORE_ATTRIBUTE = 'data-inspect-ignore'

/** Marks the element whose top-left corner anchors the 8px grid and whose width is the layout column. */
export const INSPECT_ORIGIN_ATTRIBUTE = 'data-inspect-origin'
