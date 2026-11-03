import { ArrowUpRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { TextLink } from '@/components/ui/text-link'
import type { HomeWriting as HomeWritingEntry } from '@/lib/cms/home.server'
import { SITE_ROUTES } from '@/lib/constants/routes'
import type { Copy } from '@/lib/constants/copy'
import { writingPath } from '@/lib/seo/seo.utils'
import { enter, formatMonth } from '@/lib/utils'

import { DraftTag } from './draft-tag'
import { LIST_ROW_CLASSNAME } from './list.const'

/** The latest articles: the month and the title. The label enters at `enterFrom`, then each row. */
export function HomeWriting({
  entries,
  copy,
  enterFrom,
}: {
  entries: HomeWritingEntry[]
  copy: Copy['home']
  enterFrom: number
}) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel
        enterStep={enterFrom}
        aside={
          <TextLink href={SITE_ROUTES.writing} variant="underline">
            {copy.allWriting}
          </TextLink>
        }
      >
        {copy.writing}
      </SectionLabel>
      <ul className="mt-pad-xs">
        {entries.map((post, index) => (
          <li key={post.id} {...enter(enterFrom + 1 + index)}>
            <Link href={writingPath(post.slug ?? '')} className={LIST_ROW_CLASSNAME}>
              <span className="w-16 shrink-0 font-mono text-micro text-subtle">
                {post.publishedAt ? (
                  formatMonth(post.publishedAt)
                ) : (
                  <DraftTag status={post._status} label={copy.draft} />
                )}
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate">{post.title}</span>
                <ArrowUpRight
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-4 shrink-0 text-subtle opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
