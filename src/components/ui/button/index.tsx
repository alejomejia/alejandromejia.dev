import type { ComponentProps, ReactNode } from 'react'

import { Link, type LinkProps } from '@/components/ui/link'
import { cn } from '@/lib/utils'

import { BUTTON_VARIANTS, type ButtonVariant } from './button.const'

type ButtonOwnProps = {
  children: ReactNode
  /** A trailing icon (an `<svg>`), sized to 16px. */
  icon?: ReactNode
  variant?: ButtonVariant
  className?: string
}

/** Without `href` it renders a `<button>` (`type` defaults to `"button"`). */
type ButtonAsButtonProps = ButtonOwnProps &
  Omit<ComponentProps<'button'>, keyof ButtonOwnProps> & { href?: undefined }

/** With `href` it renders the project's `Link`, so every `Link` prop works. */
type ButtonAsLinkProps = ButtonOwnProps & Omit<LinkProps, keyof ButtonOwnProps>

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

/**
 * Class names for a button, exported so other elements (a `<label>`, or a
 * link with its own animated icon, like the CV's download) share the exact
 * same look.
 */
export function buttonClassName({ variant = 'outline', className }: { variant?: ButtonVariant; className?: string } = {}) {
  return cn(
    // `w-fit` keeps it content-sized inside flex columns and grids, which
    // would otherwise stretch it; pass `w-full` to opt into full width.
    'inline-flex h-8 w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3',
    'text-caption leading-none whitespace-nowrap',
    // A press presses it in; under reduced motion it stays put.
    'transition-[background-color,border-color,opacity,scale] duration-250 active:scale-98 motion-reduce:active:scale-100',
    'disabled:cursor-not-allowed disabled:opacity-50',
    BUTTON_VARIANTS[variant],
    className,
  )
}

/**
 * The project's button: the brand's hairline box, rendered as a `<button>`
 * or as a link depending on `href`. Buttons are rare on this site; text
 * links come first. Not a client component itself; only `Link` is.
 *
 * @example
 * ```tsx
 * <Button href="/cv.pdf" icon={<ArrowDown strokeWidth={1.5} />}>Download PDF</Button>
 * <Button variant="solid" onClick={retry}>Try again</Button>
 * ```
 */
export function Button(props: ButtonProps) {
  // `href` narrows `props` to the link or the button member of the union.
  if (props.href !== undefined) {
    const { children, icon, variant, className, ...linkProps } = props
    return (
      <Link {...linkProps} className={buttonClassName({ variant, className })}>
        <ButtonContent icon={icon}>{children}</ButtonContent>
      </Link>
    )
  }

  const { children, icon, variant, className, type = 'button', ...buttonProps } = props
  return (
    <button type={type} {...buttonProps} className={buttonClassName({ variant, className })}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </button>
  )
}

/** Inner markup shared by both elements: the label, then the optional icon. */
function ButtonContent({ icon, children }: Pick<ButtonOwnProps, 'icon' | 'children'>) {
  return (
    <>
      {children}
      {icon && (
        <span aria-hidden className="pointer-events-none size-4 shrink-0 [&>svg]:size-full">
          {icon}
        </span>
      )}
    </>
  )
}

export type { ButtonVariant } from './button.const'
