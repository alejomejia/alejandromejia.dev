import { ArrowUpRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { COPY } from '@/lib/constants/copy'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { cn, enter } from '@/lib/utils'

import { LIST_ROW_CLASSNAME } from './list.const'

const SECTIONS = [
  { href: SITE_ROUTES.work, title: COPY.work.title, description: COPY.work.description },
  { href: SITE_ROUTES.writing, title: COPY.writing.title, description: COPY.writing.description },
  { href: SITE_ROUTES.craft, title: COPY.craft.title, description: COPY.craft.description },
  { href: SITE_ROUTES.cv, title: COPY.cv.title, description: COPY.notFound.cv },
]

/**
 * The site's four sections as list rows, each with its one-line
 * description, so a page that failed (the 404, the error page) still leads
 * somewhere.
 */
export function SectionLinks({ label, enterStep }: { label: string; enterStep: number }) {
  return (
    <nav aria-label={label} {...enter(enterStep)}>
      <SectionLabel>{label}</SectionLabel>
      <ul className="mt-pad-xs">
        {SECTIONS.map(({ href, title, description }) => (
          <li key={href}>
            <Link href={href} className={cn(LIST_ROW_CLASSNAME, 'flex-col gap-1')}>
              <span className="flex items-center gap-2">
                {title}
                <ArrowUpRight
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-4 shrink-0 text-subtle opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                />
              </span>
              <span className="text-caption text-pretty text-muted">{description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
