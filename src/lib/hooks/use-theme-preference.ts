'use client'

import { useSyncExternalStore } from 'react'

import { getThemePreference, subscribeTheme, type ThemePreference } from '@/lib/styles/theme-preference'

/**
 * The visitor's theme choice (`light`, `dark` or `system`), live across tabs.
 * `system` on the server and during hydration, so markup always matches;
 * change it with `setThemePreference` from `@/lib/styles/theme-preference`.
 */
export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribeTheme, getThemePreference, () => 'system')
}
