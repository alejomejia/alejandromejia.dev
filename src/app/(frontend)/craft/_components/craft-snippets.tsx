import { ArrowUpRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { craftPath } from '@/lib/seo/seo.utils'
import { cn, enter } from '@/lib/utils'

import { LIST_ROW_CLASSNAME } from '@/app/(frontend)/_components/list.const'
import { CRAFT_LAST_ENTER_STEP } from './craft.const'
import type { CraftSnippet } from './craft.types'
import { snippetLanguages } from './craft.utils'

type CraftSnippetsProps = {
  entries: CraftSnippet[]
  label: string
  /** The first row's entrance step, after what comes before it. */
  enterFrom: number
}

/** The snippets as list rows: the title (an arrow on hover) and its why, the languages on the right. */
export function CraftSnippets({ entries, label, enterFrom }: CraftSnippetsProps) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <ul className="mt-pad-xs">
        {entries.map((snippet, index) => (
          <li key={snippet.slug} {...enter(Math.min(enterFrom + index, CRAFT_LAST_ENTER_STEP))}>
            <Link
              href={craftPath(snippet.slug)}
              className={cn(LIST_ROW_CLASSNAME, 'flex-col gap-1 sm:flex-row sm:gap-4')}
            >
              <span className="flex-1">
                <span className="flex items-center gap-2">
                  {snippet.title}
                  <ArrowUpRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="size-4 shrink-0 text-subtle opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                  />
                </span>
                <span className="block text-caption text-pretty text-muted">{snippet.description}</span>
              </span>
              <span className="font-mono text-micro whitespace-nowrap text-subtle">{snippetLanguages(snippet)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
