import { ArrowUpRight } from 'lucide-react'

import { DOT_TEXTURE_CLASSNAME, MediaFrame } from '@/components/story/media-frame'
import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { TextLink } from '@/components/ui/text-link'
import { SITE_ROUTES } from '@/lib/constants/routes'
import type { HomeCraft as HomeCraftEntry } from '@/lib/cms/home.server'
import type { Copy } from '@/lib/constants/copy'
import { craftPath } from '@/lib/seo/seo.utils'
import { cn } from '@/lib/utils'

import { DraftTag } from './draft-tag'

/**
 * A sneak peek at Craft: the latest two experiments as tiles, two across,
 * like the Craft page's. The frame shows the dot texture (darkening on
 * hover) until each demo has a recording.
 */
export function HomeCraft({ entries, copy }: { entries: HomeCraftEntry[]; copy: Copy['home'] }) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel
        aside={
          <TextLink href={SITE_ROUTES.craft} variant="underline">
            {copy.allCraft}
          </TextLink>
        }
      >
        {copy.craft}
      </SectionLabel>
      <ul className="mt-pad-s grid gap-x-pad-s gap-y-pad-m sm:grid-cols-2">
        {entries.map((piece) => (
          <li key={piece.id}>
            <Link href={craftPath(piece.slug ?? '')} className="group flex flex-col gap-pad-xs">
              <MediaFrame className="aspect-video">
                <div aria-hidden className={cn(DOT_TEXTURE_CLASSNAME, 'transition-colors duration-250 group-hover:text-foreground/20')} />
              </MediaFrame>
              <span>
                <span className="flex items-center gap-2">
                  {piece.title}
                  <DraftTag status={piece._status} label={copy.draft} />
                  <ArrowUpRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="size-4 shrink-0 text-subtle opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                  />
                </span>
                <span className="block text-caption text-pretty text-muted">{piece.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
