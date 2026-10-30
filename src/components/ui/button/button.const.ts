/** Color treatments. `outline` inherits the surrounding text color. */
export const BUTTON_VARIANTS = {
  outline: 'border border-current bg-transparent',
  solid: 'bg-foreground text-background',
  light: 'bg-background text-foreground',
  accent: 'bg-accent text-accent-foreground',
  blur: 'bg-white/30 text-black shadow-[0_0.25rem_2rem_rgba(0,0,0,0.1)] backdrop-blur-[1.5rem]',
} as const

export type ButtonVariant = keyof typeof BUTTON_VARIANTS

/**
 * Outline geometry: height, radius and padding (`icon` reserves room for the
 * leading icon). Add new shapes here, not as one-off `className`s.
 */
export const BUTTON_SHAPES = {
  round: {
    base: 'h-8 rounded-full',
    padding: 'px-[1em]',
    icon: 'pr-[1em] pl-[2.6em]',
  },
  square: {
    base: 'h-8 rounded-none',
    padding: 'px-[1em]',
    icon: 'pr-[1em] pl-[2.6em]',
  },
} as const

export type ButtonShape = keyof typeof BUTTON_SHAPES
