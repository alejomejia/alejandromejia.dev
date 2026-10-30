import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import type { HomeWriting as HomeWritingEntry } from '@/lib/cms/home.server'
import { SITE_ROUTES } from '@/lib/constants/routes'
import type { Copy } from '@/lib/constants/copy'
import { writingPath } from '@/lib/seo/seo.utils'
import { formatMonth } from '@/lib/utils'

import { DraftTag } from './draft-tag'
import { LIST_LABEL_LINK_CLASSNAME, LIST_ROW_CLASSNAME } from './list.const'

/** The latest writing, any format: the month, the title, the format. */
export function HomeWriting({
  entries,
  copy,
}: {
  entries: HomeWritingEntry[]
  copy: Copy['home']
}) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel
        aside={
          <Link href={SITE_ROUTES.writing} className={LIST_LABEL_LINK_CLASSNAME}>
            {copy.allWriting}
          </Link>
        }
      >
        {copy.writing}
      </SectionLabel>
      <ul className="mt-pad-xs">
        {entries.map((post) => (
          <li key={post.id}>
            <Link href={writingPath(post.slug ?? '')} className={LIST_ROW_CLASSNAME}>
              <span className="w-16 shrink-0 font-mono text-micro text-foreground/40">
                {post.publishedAt ? formatMonth(post.publishedAt) : <DraftTag status={post._status} label={copy.draft} />}
              </span>
              <span className="flex-1 truncate">{post.title}</span>
              <span className="hidden font-mono text-micro text-foreground/40 sm:inline">{copy.formats[post.format]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
