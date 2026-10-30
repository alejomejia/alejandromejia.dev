'use client'

import { usePathname } from 'next/navigation'

import { TextLink } from '@/components/ui/text-link'
import type { NavLink } from '@/lib/cms/links'
import { isCurrentPath } from '@/lib/utils'

import { HEADER_LINK_CLASSNAME } from './header.const'

/**
 * The sidebar's menu: a column on large screens, a row on phones. The
 * current page's link is active (ink, not clickable); inside a section
 * (`/writing/…`) its link stays clickable but takes the ink color. They
 * prefetch as soon as they are in view: the menu is what most visitors click
 * next.
 */
export function HeaderNav({ navItems, label, className }: { navItems: NavLink[]; label: string; className?: string }) {
  const pathname = usePathname()
  if (navItems.length === 0) return null

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 lg:flex-col">
        {navItems.map(({ label: text, href, newTab }) => {
          const current = isCurrentPath(href, pathname)
          const inSection = !current && href !== '/' && pathname.startsWith(`${href}/`)

          return (
            <li key={`${href}-${text}`}>
              <TextLink
                href={href}
                newTab={newTab}
                prefetch="viewport"
                active={current}
                {...(inSection && { 'aria-current': 'true' as const })}
                className={HEADER_LINK_CLASSNAME}
              >
                {text}
              </TextLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
