import { SEARCH_INDEX_PATH, type SearchEntry } from '@/lib/cms/search'

// Shared by the dialog and every trigger without a provider: triggers sit in
// Server Component trees (header, footer, pages). `session` counts openings,
// so the panel starts fresh each time but keeps its contents while it fades
// out.
type CommandMenuState = { open: boolean; session: number }

let state: CommandMenuState = { open: false, session: 0 }
const listeners = new Set<() => void>()

/** Opens or closes the command menu. */
export function setCommandMenuOpen(open: boolean) {
  if (open === state.open) return
  state = { open, session: open ? state.session + 1 : state.session }
  for (const listener of listeners) listener()
}

/** The current state; a new object only when something changed (a `useSyncExternalStore` snapshot). */
export function getCommandMenuState(): CommandMenuState {
  return state
}

/** The state before hydration: closed. */
export const INITIAL_COMMAND_MENU_STATE: CommandMenuState = { open: false, session: 0 }

export function subscribeCommandMenu(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

// The content search (`/search.json`): fetched once per visit, the first time
// the menu opens (or its trigger is hovered), then kept for every opening.
let searchEntries: SearchEntry[] = []
let searchRequest: Promise<void> | null = null
const searchListeners = new Set<() => void>()

/** Starts loading the content search, once. A failed load is tried again on the next call. */
export function loadSearchEntries() {
  searchRequest ??= fetch(SEARCH_INDEX_PATH)
    .then((response) => {
      if (!response.ok) throw new Error(`Search index: ${response.status}`)
      return response.json() as Promise<SearchEntry[]>
    })
    .then((entries) => {
      searchEntries = entries
      for (const listener of searchListeners) listener()
    })
    .catch(() => {
      // Offline or a server error: the menu keeps its own rows.
      searchRequest = null
    })
}

/** The loaded content search; empty until it arrives (a `useSyncExternalStore` snapshot). */
export function getLoadedSearchEntries(): SearchEntry[] {
  return searchEntries
}

/** The content search before hydration: nothing loaded. */
export const NO_SEARCH_ENTRIES: SearchEntry[] = []

export function subscribeSearchEntries(onChange: () => void): () => void {
  searchListeners.add(onChange)
  return () => searchListeners.delete(onChange)
}
