/** A run of text in a row: plain, a link, or the button that turns inspect mode on. */
export type HowItsBuiltText = string | { text: string; href: string } | { text: string; toggle: 'inspect' }

/** One fact: a mono label, then a sentence or two. */
export type HowItsBuiltRow = { label: string; text: HowItsBuiltText[] }

/** A section of the page: its label (the `<h2>`) and its rows. */
export type HowItsBuiltSectionData = { label: string; rows: HowItsBuiltRow[] }
