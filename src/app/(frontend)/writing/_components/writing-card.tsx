import { Media } from '@/components/cms/media'
import { Link } from '@/components/ui/link'
import { cn } from '@/lib/utils'
import { writingPath } from '@/lib/seo/seo.utils'
import type { Writing } from '@/payload-types'

/** Summary card for a Writing entry in the archive grid. A placeholder until Phase 6. */
export function WritingCard({ entry, className }: { entry: Writing; className?: string }) {
  const { slug, title, topics, cover, excerpt, meta } = entry
  const image = cover || meta?.image
  const href = writingPath(slug ?? '')
  const description = excerpt || meta?.description

  const topicLabels = (topics ?? [])
    .map((topic) => (typeof topic === 'object' ? topic.title : null))
    .filter(Boolean)
    .join(', ')

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-foreground/15',
        className,
      )}
    >
      <Link href={href} className="block aspect-video overflow-hidden bg-foreground/5">
        {image && typeof image === 'object' && (
          <Media
            resource={image}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-6">
        {topicLabels && (
          <p className="text-xs uppercase tracking-wide text-foreground/60">{topicLabels}</p>
        )}
        <h3 className="text-lg font-semibold leading-snug">
          <Link href={href} className="hover:opacity-70">
            {title}
          </Link>
        </h3>
        {description && (
          <p className="line-clamp-3 text-sm text-foreground/70">{description}</p>
        )}
      </div>
    </article>
  )
}
