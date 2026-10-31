import { ArrowUpRight } from 'lucide-react'

import { DOT_TEXTURE_CLASSNAME, MediaFrame } from '@/components/story/media-frame'
import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { craftPath } from '@/lib/seo/seo.utils'
import { cn, enter } from '@/lib/utils'

import { CRAFT_LAST_ENTER_STEP } from './craft.const'
import type { CraftExperiment } from './craft.types'

type CraftExperimentsProps = {
  entries: CraftExperiment[]
  label: string
  /** The first tile's entrance step, after what comes before it. */
  enterFrom: number
}

/**
 * The experiments as tiles, two across, like the home page's: the recording
 * in its frame (the dot texture until there is one, darkening on hover),
 * then the title (an arrow on hover) and the description.
 */
export function CraftExperiments({ entries, label, enterFrom }: CraftExperimentsProps) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <ul className="mt-pad-s grid gap-x-pad-s gap-y-pad-m sm:grid-cols-2">
        {entries.map((piece, index) => (
          <li key={piece.slug} {...enter(Math.min(enterFrom + index, CRAFT_LAST_ENTER_STEP))}>
            <Link href={craftPath(piece.slug)} className="group flex flex-col gap-pad-xs rounded-xl">
              <MediaFrame media={piece.fallback} className="aspect-video" sizes="(min-width: 64rem) 20rem, (min-width: 40rem) 50vw, 100vw">
                <div aria-hidden className={cn(DOT_TEXTURE_CLASSNAME, 'transition-colors duration-250 group-hover:text-foreground/20')} />
              </MediaFrame>
              <span>
                <span className="flex items-center gap-2">
                  {piece.title}
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
