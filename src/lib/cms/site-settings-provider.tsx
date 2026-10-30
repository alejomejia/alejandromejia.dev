'use client'

import { createContext, type ReactNode, use } from 'react'

import type { NavLink } from './links'

/** The Site settings global, resolved to plain values. Empty fields are `null`, which hides what reads them. */
export type SiteSettings = {
  contact: {
    email: string | null
  }
  /** Official profiles; they always open in a new tab. */
  socialLinks: NavLink[]
}

const SiteSettingsContext = createContext<SiteSettings | null>(null)

/**
 * Hands the Site settings global to Client Components. Mounted once by the
 * frontend root layout, which reads the global with `querySiteSettings()`.
 */
export function SiteSettingsProvider({ settings, children }: { settings: SiteSettings; children: ReactNode }) {
  return <SiteSettingsContext value={settings}>{children}</SiteSettingsContext>
}

/** The Site settings global. Server Components use `querySiteSettings()` instead. */
export function useSiteSettings(): SiteSettings {
  const settings = use(SiteSettingsContext)
  if (!settings) throw new Error('useSiteSettings() needs a <SiteSettingsProvider> (the frontend layout mounts it).')
  return settings
}
