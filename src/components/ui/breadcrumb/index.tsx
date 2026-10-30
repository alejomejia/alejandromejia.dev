'use client'

import { Fragment } from 'react'

import { Link } from '@/components/ui/link'
import { COPY } from '@/lib/constants/copy'
import { cn } from '@/lib/utils'

/** One step of the trail. Without `href` it renders as plain text. */
export type Crumb = {
  label: string
  /** Site path (`/writing`). */
  href?: string
}

type BreadcrumbProps = {
  /** The trail after Home; the last crumb is the current page. */
  crumbs: Crumb[]
  className?: string
}

/**
 * Small caption trail at the top of an interior page: Home / … / current
 * page. Pair it with `breadcrumbJsonLd()` so search engines see the same
 * trail.
 *
 * @example <Breadcrumb crumbs={[{ label: 'Writing', href: '/writing' }, { label: entry.title }]} />
 */
export function Breadcrumb({ crumbs, className }: BreadcrumbProps) {
  const copy = COPY.breadcrumb
  const trail: Crumb[] = [{ label: copy.home, href: '/' }, ...crumbs]

  return (
    <nav aria-label={copy.label} className={cn('text-caption', className)}>
      <ol className="flex flex-wrap gap-pad-xs">
        {trail.map((crumb, index) => {
          const current = index === trail.length - 1
          return (
            <Fragment key={`${index}-${crumb.label}`}>
              {index > 0 && (
                <li aria-hidden className="opacity-60">
                  /
                </li>
              )}
              <li aria-current={current ? 'page' : undefined}>
                {current || !crumb.href ? (
                  crumb.label
                ) : (
                  <Link href={crumb.href} className="opacity-60 transition-opacity duration-300 hover:opacity-100">
                    {crumb.label}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
