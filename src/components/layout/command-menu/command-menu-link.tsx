'use client'

import type { ReactNode } from 'react'

import { TextLink, type TextLinkVariant } from '@/components/ui/text-link'

import { loadSearchEntries, setCommandMenuOpen } from './command-menu.store'

/**
 * Opens the command menu from a text link inside copy ("or search the
 * site"), with the trigger's head start: the content search starts loading
 * on hover or focus, before the click lands.
 *
 * @example
 * <CommandMenuLink variant="underline">search the site</CommandMenuLink>
 */
export function CommandMenuLink({
  children,
  variant,
  className,
}: {
  children: ReactNode
  variant?: TextLinkVariant
  className?: string
}) {
  return (
    <TextLink
      variant={variant}
      onClick={() => setCommandMenuOpen(true)}
      onPointerEnter={loadSearchEntries}
      onFocus={loadSearchEntries}
      aria-haspopup="dialog"
      className={className}
    >
      {children}
    </TextLink>
  )
}
