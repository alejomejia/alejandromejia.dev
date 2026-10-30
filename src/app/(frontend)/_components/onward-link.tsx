import { ArrowRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { cn } from '@/lib/utils'

import { LIST_ROW_CLASSNAME } from './list.const'

type OnwardLinkProps = {
  /** What comes next: "Next chapter", "Next case study", "Next article". */
  label: string
  href: string
  title: string
  summary: string
  /** Mono meta on the right: the chapter number, the years, the month. */
  meta: string
}

/** The way on at the end of a page: one list row below a hairline, so a case study or article never dead-ends. */
export function OnwardLink({ label, href, title, summary, meta }: OnwardLinkProps) {
  return (
    <nav aria-label={label} className="border-t border-foreground/10 pt-pad-s">
      <SectionLabel>{label}</SectionLabel>
      <Link href={href} className={cn(LIST_ROW_CLASSNAME, 'mt-pad-xs flex-col gap-1 sm:flex-row sm:gap-4')}>
        <span className="flex-1">
          <span className="flex items-center gap-2">
            {title}
            <ArrowRight
              aria-hidden
              strokeWidth={1.5}
              className="size-4 -translate-x-1 text-foreground/40 opacity-0 transition-[opacity,translate] duration-250 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </span>
          <span className="block text-caption text-pretty text-foreground/60">{summary}</span>
        </span>
        <span className="font-mono text-micro text-foreground/40">{meta}</span>
      </Link>
    </nav>
  )
}
