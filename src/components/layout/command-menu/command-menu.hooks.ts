'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useSyncExternalStore } from 'react'

import { setInspectEnabled, useInspectEnabled } from '@/components/effects/inspect-mode'
import type { NavLink } from '@/lib/cms/links'
import { useSiteSettings } from '@/lib/cms/site-settings-provider'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { SITE } from '@/lib/seo/seo.const'
import { isCurrentPath } from '@/lib/utils'

import {
  getCommandMenuState,
  getLoadedSearchEntries,
  NO_SEARCH_ENTRIES,
  setCommandMenuOpen,
  subscribeSearchEntries,
} from './command-menu.store'
import type { CommandItem } from './command-menu.types'

function noSubscription() {
  return () => {}
}

function isApplePlatform(): boolean {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
}

/** Whether the shortcut reads ⌘K (Apple devices, and the server's guess) or Ctrl K. */
export function useIsApplePlatform(): boolean {
  return useSyncExternalStore(noSubscription, isApplePlatform, () => true)
}

/** ⌘K / Ctrl+K opens the menu from anywhere, and closes it again. */
export function useCommandMenuShortcut() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return
      event.preventDefault()
      setCommandMenuOpen(!getCommandMenuState().open)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}

/** Copies `text`; `'keep-open'` shows "Copied" on the row before the menu closes. */
async function copy(text: string): Promise<'keep-open' | void> {
  try {
    await navigator.clipboard.writeText(text)
    return 'keep-open'
  } catch {
    // Clipboard blocked (permissions, insecure context): nothing to confirm.
  }
}

/**
 * Every row of the menu: the pages (Home, the header's links, CV),
 * the actions (copy the email or this page's link, inspect mode) and the
 * links out (email, the Site settings profiles, RSS, the source code). Rows without data
 * (no email set) are left out.
 */
export function useCommandItems(navItems: NavLink[]): CommandItem[] {
  const { commandMenu: copyText, header, footer, inspect } = COPY
  const { contact, socialLinks } = useSiteSettings()
  const inspecting = useInspectEnabled()
  const pathname = usePathname()

  const pages: NavLink[] = [
    { label: header.home, href: SITE_ROUTES.home },
    ...navItems,
    { label: header.cv, href: SITE_ROUTES.cv },
  ]

  return [
    ...pages.map(({ label, href, newTab }) => ({
      id: `page-${href}`,
      group: 'pages' as const,
      label,
      href,
      newTab,
      current: isCurrentPath(href, pathname),
    })),

    ...(contact.email
      ? [{ id: 'copy-email', group: 'actions' as const, label: copyText.copyEmail, keywords: ['mail', 'contact'], run: () => copy(contact.email!) }]
      : []),
    {
      id: 'copy-link',
      group: 'actions',
      label: copyText.copyLink,
      keywords: ['url', 'share'],
      run: () => copy(window.location.href),
    },
    {
      id: 'inspect',
      group: 'actions',
      label: inspect.title,
      keywords: ['figma', 'grid', 'spacing', 'measure'],
      current: inspecting,
      run: () => setInspectEnabled(!inspecting),
    },

    ...(contact.email
      ? [{ id: 'email', group: 'links' as const, label: footer.email, keywords: ['contact'], href: `mailto:${contact.email}` }]
      : []),
    ...socialLinks.map(({ label, href }) => ({ id: `link-${href}`, group: 'links' as const, label, href, newTab: true })),
    { id: 'rss', group: 'links', label: footer.rss, keywords: ['feed', 'subscribe'], href: SITE_ROUTES.rss },
    {
      id: 'source',
      group: 'links',
      label: footer.source,
      keywords: ['github', 'repository', 'code', 'colophon'],
      href: SITE.repository,
      newTab: true,
    },
  ]
}

/**
 * The content search's rows (pages, case studies and their chapters, writing),
 * once `/search.json` has loaded; none before. Shown only while searching.
 */
export function useSearchItems(): CommandItem[] {
  const entries = useSyncExternalStore(subscribeSearchEntries, getLoadedSearchEntries, () => NO_SEARCH_ENTRIES)
  const pathname = usePathname()

  return useMemo(
    () =>
      entries.map(({ group, title, path, detail }) => ({
        id: `search-${path}`,
        group,
        label: title,
        detail,
        href: path,
        current: isCurrentPath(path, pathname),
      })),
    [entries, pathname],
  )
}
