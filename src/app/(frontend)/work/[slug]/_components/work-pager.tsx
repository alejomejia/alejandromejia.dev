import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { cn } from '@/lib/utils'

import { LIST_ROW_CLASSNAME } from '@/app/(frontend)/_components/list.const'

/** One side of the pager: what it leads to and its mono meta (the chapter number, or the years). */
export type WorkPagerLink = { label: string; href: string; title: string; meta: string }

type WorkPagerProps = {
  /** Names the landmark. */
  label: string
  /** Empty on the overview, which has nothing before it. */
  previous: WorkPagerLink | null
  next: WorkPagerLink
}

/**
 * The end of a chaptered case study page, below a hairline: the previous
 * page on the left and the next one on the right (stacked on phones), each
 * a whole-row link whose arrow turns ink on hover.
 */
export function WorkPager({ label, previous, next }: WorkPagerProps) {
  return (
    <nav
      aria-label={label}
      className="grid gap-pad-xs border-t border-foreground/10 pt-pad-s sm:grid-cols-2 sm:gap-pad-s"
    >
      {previous ? <PagerLink link={previous} direction="previous" /> : <span aria-hidden />}
      <PagerLink link={next} direction="next" />
    </nav>
  )
}

function PagerLink({ link, direction }: { link: WorkPagerLink; direction: 'previous' | 'next' }) {
  const isNext = direction === 'next'
  const Arrow = isNext ? ArrowRight : ArrowLeft

  return (
    <Link
      href={link.href}
      rel={isNext ? 'next' : 'prev'}
      className={cn(LIST_ROW_CLASSNAME, 'flex-col gap-1', isNext && 'sm:items-end sm:text-right')}
    >
      <span className="font-mono text-micro text-subtle">{link.label}</span>
      <span className={cn('flex items-center gap-2', isNext && 'sm:flex-row-reverse')}>
        <Arrow
          aria-hidden
          strokeWidth={1.5}
          className="size-4 shrink-0 text-subtle transition-colors duration-250 group-hover:text-foreground"
        />
        <span>
          {link.meta && <span className="mr-2 font-mono text-micro text-subtle">{link.meta}</span>}
          {link.title}
        </span>
      </span>
    </Link>
  )
}
