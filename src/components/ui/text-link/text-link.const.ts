/** Classes every variant shares: content-sized, even in flex columns and grids. */
export const TEXT_LINK_BASE = 'inline-block w-fit cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'

/** 1px `currentColor` line along the bottom; variants animate its size. */
const UNDERLINE_LINE = 'pb-[0.1em] bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat'

/**
 * Hover treatments. The underlines animate `background-size` of a 1px
 * gradient (cheaper and crisper than `text-decoration` transitions); only the
 * size transitions, so the snapped `background-position` picks the side it
 * grows from or retracts to. `data-leaving` (set by `PageTransition` on the
 * link that started a navigation) holds the hover look while the page leaves.
 */
export const TEXT_LINK_VARIANTS = {
  /** Shown by default: retracts to the right on hover, redraws from the left on leave. */
  underline: {
    base: [
      UNDERLINE_LINE,
      'bg-[length:100%_1px] bg-[position:0_100%]',
      'transition-[background-size] duration-500 ease-out-expo',
      'hover:bg-[length:0%_1px] hover:bg-[position:100%_100%]',
      'data-leaving:bg-[length:0%_1px] data-leaving:bg-[position:100%_100%]',
    ].join(' '),
    active: 'pointer-events-none',
  },
  /** The reverse: hidden by default, draws from the left on hover, retracts to the right on leave. */
  'underline-reveal': {
    base: [
      UNDERLINE_LINE,
      'bg-[length:0%_1px] bg-[position:100%_100%]',
      'transition-[background-size] duration-500 ease-out-expo',
      'hover:bg-[length:100%_1px] hover:bg-[position:0_100%]',
      'data-leaving:bg-[length:100%_1px] data-leaving:bg-[position:0_100%]',
    ].join(' '),
    // Drawn from the left, like a hover, when it turns on.
    active: 'pointer-events-none bg-[length:100%_1px] bg-[position:0_100%]',
  },
} as const

export type TextLinkVariant = keyof typeof TEXT_LINK_VARIANTS
