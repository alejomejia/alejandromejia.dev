import type { NavLink } from '@/lib/cms/links'

export type CommandGroup = 'pages' | 'work' | 'writing' | 'actions' | 'links'

/** One row of the menu: it navigates (`href`) or runs something (`run`). */
export type CommandItem = {
  id: string
  group: CommandGroup
  label: string
  /** Muted text after the label (a writing format, a chapter's case study). */
  detail?: string
  /** Extra words it is found by (`dark`, `mode` for a theme item). */
  keywords?: string[]
  href?: string
  /** Opens `href` in a new tab (other websites). */
  newTab?: boolean
  /** Runs instead of navigating. Return `'keep-open'` to show the result before closing. */
  run?: () => void | 'keep-open' | Promise<void | 'keep-open'>
  /** Marks the current choice (the active theme, the current page). */
  current?: boolean
}

export type CommandMenuProps = {
  /** The header's main links (Work, Writing, …). Home and CV are added. */
  navItems: NavLink[]
}
