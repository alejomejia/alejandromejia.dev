'use client'

import { usePathname } from 'next/navigation'

import { isCurrentPath } from '@/lib/utils'

import { TextLink, type TextLinkProps } from '.'

type NavTextLinkProps = Extract<TextLinkProps, { href: unknown }> & { href: string }

/**
 * A `TextLink` that turns `active` on by itself when its `href` is the
 * current page. For nav lists rendered from Server
 * Components, which can't read the pathname.
 *
 * @example
 * ```tsx
 * <NavTextLink href="/terms">Terms</NavTextLink>
 * ```
 */
export function NavTextLink({ href, active, ...props }: NavTextLinkProps) {
  const pathname = usePathname()
  return <TextLink href={href} active={active ?? isCurrentPath(href, pathname)} {...props} />
}
