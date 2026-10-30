import type { ComponentProps, ReactNode } from 'react'

import { Link, type LinkProps } from '@/components/ui/link'
import { cn } from '@/lib/utils'

import { BUTTON_SHAPES, BUTTON_VARIANTS, type ButtonShape, type ButtonVariant } from './button.const'

type ButtonOwnProps = {
  children: ReactNode
  icon?: ReactNode
  variant?: ButtonVariant
  shape?: ButtonShape
  className?: string
}

/** Without `href` it renders a `<button>` (`type` defaults to `"button"`). */
type ButtonAsButtonProps = ButtonOwnProps &
  Omit<ComponentProps<'button'>, keyof ButtonOwnProps> & { href?: undefined }

/** With `href` it renders the project's `Link`, so every `Link` prop works. */
type ButtonAsLinkProps = ButtonOwnProps & Omit<LinkProps, keyof ButtonOwnProps>

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

/**
 * Class names for a button, exported so other elements (e.g. a `<label>` or a
 * `<summary>`) can share the exact same look.
 */
export function buttonClassName({
  variant = 'outline',
  shape = 'round',
  withIcon = false,
  className,
}: {
  variant?: ButtonVariant
  shape?: ButtonShape
  withIcon?: boolean
  className?: string
} = {}) {
  const shapeClasses = BUTTON_SHAPES[shape]
  return cn(
    // `w-fit` keeps it content-sized inside flex columns and grids, which
    // would otherwise stretch it; pass `w-full` to opt into full width.
    'relative inline-flex w-fit shrink-0 cursor-pointer items-center',
    'text-caption leading-none whitespace-nowrap',
    'disabled:cursor-not-allowed disabled:opacity-50',
    shapeClasses.base,
    withIcon ? shapeClasses.icon : shapeClasses.padding,
    BUTTON_VARIANTS[variant],
    className,
  )
}

/**
 * The project's button: one look, rendered as a `<button>` or as a link
 * depending on `href`. Not a client component itself; only `Link` is.
 *
 * @example
 * ```tsx
 * <Button href="/cv" icon={<FileText />}>Read the CV</Button>
 * <Button variant="light" onClick={close}>Close</Button>
 * ```
 */
export function Button(props: ButtonProps) {
  // `href` narrows `props` to the link or the button member of the union.
  if (props.href !== undefined) {
    const { children, icon, variant, shape, className, ...linkProps } = props
    return (
      <Link {...linkProps} className={buttonClassName({ variant, shape, withIcon: Boolean(icon), className })}>
        <ButtonContent icon={icon}>{children}</ButtonContent>
      </Link>
    )
  }

  const { children, icon, variant, shape, className, type = 'button', ...buttonProps } = props
  return (
    <button
      type={type}
      {...buttonProps}
      className={buttonClassName({ variant, shape, withIcon: Boolean(icon), className })}
    >
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </button>
  )
}

/** Inner markup shared by both elements: the optional icon, then the label. */
function ButtonContent({ icon, children }: Pick<ButtonOwnProps, 'icon' | 'children'>) {
  return (
    <>
      {icon && (
        <span className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 [&>svg]:size-full">
          {icon}
        </span>
      )}
      {children}
    </>
  )
}

export type { ButtonShape, ButtonVariant } from './button.const'
