import type { ComponentProps } from 'react'

import { Link, type LinkProps } from '@/components/ui/link'
import { cn } from '@/lib/utils'

import { TEXT_LINK_BASE, TEXT_LINK_VARIANTS, type TextLinkVariant } from './text-link.const'

type TextLinkOwnProps = {
  variant?: TextLinkVariant
  /** Current state (same path, or a selected toggle): keeps the hover treatment on and disables clicks. */
  active?: boolean
  className?: string
}

/** Without `href` it renders a `<button>` (`type` defaults to `"button"`). */
type TextLinkAsButtonProps = TextLinkOwnProps &
  Omit<ComponentProps<'button'>, keyof TextLinkOwnProps> & { href?: undefined }

/** With `href` it renders the project's `Link`, so every `Link` prop works. */
type TextLinkAsLinkProps = TextLinkOwnProps & Omit<LinkProps, keyof TextLinkOwnProps>

export type TextLinkProps = TextLinkAsButtonProps | TextLinkAsLinkProps

/**
 * Class names for a text link, exported so other elements (e.g. a
 * `<summary>`) can share the exact same treatment.
 */
export function textLinkClassName({
  variant = 'underline-reveal',
  active = false,
  className,
}: {
  variant?: TextLinkVariant
  active?: boolean
  className?: string
} = {}) {
  const { base, active: activeClasses } = TEXT_LINK_VARIANTS[variant]
  return cn(TEXT_LINK_BASE, base, active && activeClasses, className)
}

/**
 * Inline text link with an animated hover, rendered as a link or as a
 * `<button>` depending on `href`: `underline-reveal` (default) draws its
 * underline on hover, `underline` retracts and redraws it.
 *
 * @example
 * ```tsx
 * <TextLink href="/work">Work</TextLink>
 * <TextLink href="/about" variant="underline-reveal">Meet the studio</TextLink>
 * <TextLink onClick={openMenu} aria-expanded={menuOpen}>Menu</TextLink>
 * ```
 */
export function TextLink(props: TextLinkProps) {
  // `href` narrows `props` to the link or the button member of the union.
  if (props.href !== undefined) {
    const { variant, active, className, ...linkProps } = props
    return (
      <Link
        aria-current={active ? 'page' : undefined}
        {...linkProps}
        className={textLinkClassName({ variant, active, className })}
      />
    )
  }

  const { variant, active, className, type = 'button', ...buttonProps } = props
  return <button type={type} {...buttonProps} className={textLinkClassName({ variant, active, className })} />
}

export type { TextLinkVariant } from './text-link.const'
