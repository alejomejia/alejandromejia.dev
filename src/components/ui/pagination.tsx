import { Link } from '@/components/ui/link'
import type { Copy } from '@/lib/constants/copy'
import { formatMessage } from '@/lib/utils'

const linkClass =
  'rounded-full border border-foreground/15 px-4 py-2 text-sm transition-colors hover:bg-foreground/5'

/** Prev/next pager linking to `/writing` and `/writing/page/N`. */
export function Pagination({
  page,
  totalPages,
  labels,
  basePath = '/writing',
}: {
  page: number
  totalPages: number
  labels: Copy['pagination']
  basePath?: string
}) {
  if (totalPages <= 1) return null

  const hrefFor = (target: number) => (target <= 1 ? basePath : `${basePath}/page/${target}`)

  return (
    <nav className="mt-12 flex items-center justify-center gap-4 text-sm" aria-label={labels.label}>
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass}>
          {labels.previous}
        </Link>
      ) : (
        <span aria-hidden className="opacity-0">
          {labels.previous}
        </span>
      )}

      <span className="text-foreground/60">
        {formatMessage(labels.status, { page, total: totalPages })}
      </span>

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={linkClass}>
          {labels.next}
        </Link>
      ) : (
        <span aria-hidden className="opacity-0">
          {labels.next}
        </span>
      )}
    </nav>
  )
}
