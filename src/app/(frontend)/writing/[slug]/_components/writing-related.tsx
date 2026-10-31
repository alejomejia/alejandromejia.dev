import { ArrowUpRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { workPath } from '@/lib/seo/seo.utils'
import { cn } from '@/lib/utils'

import { LIST_ROW_CLASSNAME } from '@/app/(frontend)/_components/list.const'
import type { WritingRelatedWork } from '@/app/(frontend)/writing/_components/writing.types'

/** The case studies the article draws on, as Work lists them: title (an arrow on hover) and summary. */
export function WritingRelated({ entries, label }: { entries?: WritingRelatedWork[]; label: string }) {
  if (!entries?.length) return null

  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <ul className="mt-pad-xs">
        {entries.map((work) => (
          <li key={work.slug}>
            <Link href={workPath(work.slug)} className={cn(LIST_ROW_CLASSNAME, 'flex-col gap-1')}>
              <span className="flex items-center gap-2">
                {work.title}
                <ArrowUpRight
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-4 shrink-0 text-subtle opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                />
              </span>
              <span className="block text-caption text-pretty text-muted">{work.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
