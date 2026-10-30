/** A color scheme. */
export type Theme = 'light' | 'dark'

/** What the visitor picked: a fixed scheme, or whatever the OS uses. */
export type ThemePreference = Theme | 'system'

/** `localStorage` key of the visitor's choice. Absent means `system`. */
const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

/** The browser chrome color per scheme (`<meta name="theme-color">`). Keep in step with `--background` in tokens.css. */
export const THEME_COLORS: Record<Theme, string> = {
  light: '#fcfcfc',
  dark: '#0f0f0f',
}

const listeners = new Set<() => void>()

/**
 * Runs in `<head>` before the first paint (the frontend layout inlines it), so
 * a stored choice applies without a flash of the other scheme. Without JS, or
 * with no stored choice, `<html>` has no `data-theme` and `tokens.css` follows
 * the OS.
 */
export const THEME_SCRIPT = `try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`

/** The visitor's stored choice; `system` when there is none or storage is blocked. */
export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

/** The scheme a preference shows right now (`system` resolves through the OS setting). */
export function resolveTheme(preference: ThemePreference): Theme {
  if (preference !== 'system') return preference
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/**
 * Applies a preference to the page: `data-theme` on `<html>` for a fixed
 * scheme (none for `system`, so CSS follows the OS) and the browser chrome
 * color. Doesn't store it; see {@link setThemePreference}.
 */
export function applyTheme(preference: ThemePreference) {
  const root = document.documentElement
  if (preference === 'system') delete root.dataset.theme
  else root.dataset.theme = preference

  // The layout renders one meta per scheme, each with its `media` query. A
  // fixed scheme overrides both; `system` gives each its own color back.
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    const own: Theme = meta.media.includes('dark') ? 'dark' : 'light'
    meta.content = THEME_COLORS[preference === 'system' ? own : preference]
  }
}

/** Stores and applies a preference, and notifies {@link subscribeTheme} listeners. */
export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === 'system') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Storage blocked (private mode, site data off): the choice lasts for this page only.
  }
  applyTheme(preference)
  for (const listener of listeners) listener()
}

/**
 * Switches to the other scheme from the one on screen. Landing back on the
 * OS's scheme clears the stored choice, so the site follows the OS again.
 */
export function toggleTheme() {
  const next: Theme = resolveTheme(getThemePreference()) === 'dark' ? 'light' : 'dark'
  setThemePreference(next === resolveTheme('system') ? 'system' : next)
}

/**
 * Calls `onChange` when the preference changes, in this tab or another one
 * (the `storage` event). Shaped for `useSyncExternalStore`.
 */
export function subscribeTheme(onChange: () => void): () => void {
  function handleStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY) return
    applyTheme(getThemePreference())
    onChange()
  }

  listeners.add(onChange)
  window.addEventListener('storage', handleStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', handleStorage)
  }
}
