import type { NavLink } from '@/lib/cms/links'

export type CommandGroup = 'pages' | 'work' | 'writing' | 'craft' | 'actions' | 'links'

/** One row of the menu: it navigates (`href`) or runs something (`run`). */
export type CommandItem = {
  id: string
  group: CommandGroup
  label: string
  /** Muted text after the label (a chapter's case study, a Craft piece's kind). */
  detail?: string
  /** Extra words it is found by (`mail`, `contact` for the email). */
  keywords?: string[]
  href?: string
  /** Opens `href` in a new tab (other websites). */
  newTab?: boolean
  /** Runs instead of navigating. Return `'keep-open'` to show the result before closing. */
  run?: () => void | 'keep-open' | Promise<void | 'keep-open'>
  /** Marks the current state (the current page, inspect mode on). */
  current?: boolean
}

export type CommandMenuProps = {
  /** The header's main links (Work, Writing, …). Home and CV are added. */
  navItems: NavLink[]
}
