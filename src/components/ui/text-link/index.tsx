import type { ComponentProps, ReactNode } from 'react'

import { Link, type LinkProps } from '@/components/ui/link'
import { cn } from '@/lib/utils'

import {
  TEXT_LINK_BASE,
  TEXT_LINK_ICON,
  TEXT_LINK_VARIANTS,
  TEXT_LINK_WITH_ICON,
  type TextLinkIconPosition,
  type TextLinkVariant,
} from './text-link.const'

type TextLinkOwnProps = {
  variant?: TextLinkVariant
  /** Current state (same path, or a selected toggle): keeps the hover treatment on and disables clicks. */
  active?: boolean
  /** An icon beside the label (an arrow); the underline skips it and it nudges on hover. */
  icon?: ReactNode
  iconPosition?: TextLinkIconPosition
  children?: ReactNode
  className?: string
}

/** Without `href` it renders a `<button>` (`type` defaults to `"button"`). */
type TextLinkAsButtonProps = TextLinkOwnProps &
  Omit<ComponentProps<'button'>, keyof TextLinkOwnProps> & { href?: undefined }

/** With `href` it renders the project's `Link`, so every `Link` prop works. */
type TextLinkAsLinkProps = TextLinkOwnProps & Omit<LinkProps, keyof TextLinkOwnProps>

export type TextLinkProps = TextLinkAsButtonProps | TextLinkAsLinkProps

/** Class names for the link (or button) itself: layout, hover color and the active state. */
export function textLinkClassName({
  variant = 'underline-reveal',
  active = false,
  withIcon = false,
  className,
}: {
  variant?: TextLinkVariant
  active?: boolean
  withIcon?: boolean
  className?: string
} = {}) {
  return cn(TEXT_LINK_BASE, withIcon && TEXT_LINK_WITH_ICON, active && TEXT_LINK_VARIANTS[variant].active, className)
}

/** Class names for the label inside, which carries the underline. */
export function textLinkLabelClassName({ variant = 'underline-reveal', active = false }: { variant?: TextLinkVariant; active?: boolean } = {}) {
  const { label, activeLabel } = TEXT_LINK_VARIANTS[variant]
  return cn(label, active && activeLabel)
}

/**
 * The site's text link, rendered as a link or as a `<button>` depending on
 * `href`. Every one turns ink on hover. `underline` keeps a line under the
 * label at rest (for links inside a sentence, whose color matches the text);
 * `underline-reveal` (default) draws it on hover (for standalone links in
 * menus and label rows). An optional icon sits beside the label, outside the
 * underline, and nudges on hover.
 *
 * @example
 * ```tsx
 * <TextLink href="/work">Work</TextLink>
 * <TextLink href="/writing" variant="underline">Writing</TextLink>
 * <TextLink href={url} variant="underline" icon={<ArrowUpRight />}>chromaway.com</TextLink>
 * <TextLink onClick={openMenu} aria-expanded={menuOpen}>Menu</TextLink>
 * ```
 */
export function TextLink(props: TextLinkProps) {
  // `href` narrows `props` to the link or the button member of the union.
  if (props.href !== undefined) {
    const { variant, active, icon, iconPosition, children, className, ...linkProps } = props
    return (
      <Link
        aria-current={active ? 'page' : undefined}
        {...linkProps}
        className={textLinkClassName({ variant, active, withIcon: Boolean(icon), className })}
      >
        <TextLinkContent variant={variant} active={active} icon={icon} iconPosition={iconPosition}>
          {children}
        </TextLinkContent>
      </Link>
    )
  }

  const { variant, active, icon, iconPosition, children, className, type = 'button', ...buttonProps } = props
  return (
    <button type={type} {...buttonProps} className={textLinkClassName({ variant, active, withIcon: Boolean(icon), className })}>
      <TextLinkContent variant={variant} active={active} icon={icon} iconPosition={iconPosition}>
        {children}
      </TextLinkContent>
    </button>
  )
}

/** The label (with the underline) and the optional icon on its side. */
function TextLinkContent({
  variant,
  active,
  icon,
  iconPosition = 'end',
  children,
}: Pick<TextLinkOwnProps, 'variant' | 'active' | 'icon' | 'iconPosition' | 'children'>) {
  const iconNode = icon && (
    <span aria-hidden className={cn(TEXT_LINK_ICON.base, TEXT_LINK_ICON[iconPosition])}>
      {icon}
    </span>
  )

  return (
    <>
      {iconPosition === 'start' && iconNode}
      <span className={textLinkLabelClassName({ variant, active })}>{children}</span>
      {iconPosition === 'end' && iconNode}
    </>
  )
}

export type { TextLinkIconPosition, TextLinkVariant } from './text-link.const'
