import { ArrowUpRight } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { TextLink } from '@/components/ui/text-link'
import type { HomeWriting as HomeWritingEntry } from '@/lib/cms/home.server'
import { SITE_ROUTES } from '@/lib/constants/routes'
import type { Copy } from '@/lib/constants/copy'
import { writingPath } from '@/lib/seo/seo.utils'
import { formatMonth } from '@/lib/utils'

import { DraftTag } from './draft-tag'
import { LIST_ROW_CLASSNAME } from './list.const'

/** The latest writing, any format: the month, the title, the format. */
export function HomeWriting({ entries, copy }: { entries: HomeWritingEntry[]; copy: Copy['home'] }) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel
        aside={
          <TextLink href={SITE_ROUTES.writing} variant="underline">
            {copy.allWriting}
          </TextLink>
        }
      >
        {copy.writing}
      </SectionLabel>
      <ul className="mt-pad-xs">
        {entries.map((post) => (
          <li key={post.id}>
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
              <span className="hidden font-mono text-micro text-subtle sm:inline">{copy.formats[post.format]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
