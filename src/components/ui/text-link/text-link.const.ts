/**
 * Classes every variant shares, on the link itself: content-sized (even in
 * flex columns and grids), and ink on hover, like every link on the site
 * (also while its page leaves, see `data-leaving` below). The color fades
 * here while the underline animates on the label inside, so neither
 * transition replaces the other.
 */
export const TEXT_LINK_BASE =
  'group/link inline-block w-fit cursor-pointer transition-colors duration-250 hover:text-foreground data-leaving:text-foreground disabled:cursor-not-allowed disabled:opacity-50'

/** With an icon: label and icon side by side. */
export const TEXT_LINK_WITH_ICON = 'inline-flex items-center gap-1'

/** 1px `currentColor` line along the label's bottom; variants animate its size. */
const UNDERLINE_LINE =
  'pb-[0.1em] bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat transition-[background-size] duration-500 ease-out-expo'

/**
 * Underline treatments, drawn on the label (the text only, never under an
 * icon) and driven by the link's hover. They animate `background-size` of a
 * 1px gradient (cheaper and crisper than `text-decoration` transitions);
 * only the size transitions, so the snapped `background-position` picks the
 * side it grows from or retracts to. `data-leaving` (set by `PageTransition`
 * on the link that started a navigation) holds the hover look while the page
 * leaves.
 */
export const TEXT_LINK_VARIANTS = {
  /**
   * For links inside a sentence or a value, whose color matches the text
   * around them: underlined at rest so they read as links, the line
   * retracts to the right on hover and redraws from the left on leave.
   */
  underline: {
    label: [
      UNDERLINE_LINE,
      'bg-[length:100%_1px] bg-[position:0_100%]',
      'group-hover/link:bg-[length:0%_1px] group-hover/link:bg-[position:100%_100%]',
      'group-data-leaving/link:bg-[length:0%_1px] group-data-leaving/link:bg-[position:100%_100%]',
    ].join(' '),
    active: 'pointer-events-none',
    activeLabel: '',
  },
  /**
   * For standalone links (menus, label rows, back links), which their place
   * and gray already mark as links: no line at rest, it draws from the left
   * on hover and retracts to the right on leave.
   */
  'underline-reveal': {
    label: [
      UNDERLINE_LINE,
      'bg-[length:0%_1px] bg-[position:100%_100%]',
      'group-hover/link:bg-[length:100%_1px] group-hover/link:bg-[position:0_100%]',
      'group-data-leaving/link:bg-[length:100%_1px] group-data-leaving/link:bg-[position:0_100%]',
    ].join(' '),
    active: 'pointer-events-none',
    // Drawn from the left, like a hover, when it turns on.
    activeLabel: 'bg-[length:100%_1px] bg-[position:0_100%]',
  },
} as const

export type TextLinkVariant = keyof typeof TEXT_LINK_VARIANTS

/**
 * The icon's nudge on hover, by where it sits: a leading icon (a back arrow)
 * steps back, a trailing one (an up-right arrow) steps toward where it goes.
 */
export const TEXT_LINK_ICON = {
  base: 'inline-flex shrink-0 transition-transform duration-250 ease-out-quint [&>svg]:size-3.5',
  start: 'group-hover/link:-translate-x-0.5',
  end: 'group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5',
} as const

export type TextLinkIconPosition = 'start' | 'end'
