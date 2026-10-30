/**
 * Color treatments, both on the brand's box: a 32px-tall hairline box with
 * 8px corners, never a pill, never a shadow (see the brand skill).
 */
export const BUTTON_VARIANTS = {
  /** The default: a hairline, then a firmer line and a faint fill on hover or keyboard focus. */
  outline:
    'border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/3 focus-visible:border-foreground/20 focus-visible:bg-foreground/3',
  /** Ink, for the one primary action of a screen. */
  solid: 'border border-foreground bg-foreground text-background hover:opacity-80 focus-visible:opacity-80',
} as const

export type ButtonVariant = keyof typeof BUTTON_VARIANTS
