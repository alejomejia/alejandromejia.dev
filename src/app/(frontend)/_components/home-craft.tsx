import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'
import { SITE_ROUTES } from '@/lib/constants/routes'
import type { HomeCraft as HomeCraftEntry } from '@/lib/cms/home.server'
import type { Copy } from '@/lib/constants/copy'
import { craftPath } from '@/lib/seo/seo.utils'

import { DraftTag } from './draft-tag'
import { LIST_LABEL_LINK_CLASSNAME } from './list.const'

/**
 * The latest experiments as tiles, two across. The tile is an empty surface
 * until Phase 7 puts each demo's recording in it.
 */
export function HomeCraft({ entries, copy }: { entries: HomeCraftEntry[]; copy: Copy['home'] }) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel
        aside={
          <Link href={SITE_ROUTES.craft} className={LIST_LABEL_LINK_CLASSNAME}>
            {copy.allCraft}
          </Link>
        }
      >
        {copy.craft}
      </SectionLabel>
      <ul className="mt-pad-s grid grid-cols-2 gap-pad-s">
        {entries.map((piece) => (
          <li key={piece.id}>
            <Link href={craftPath(piece.slug ?? '')} className="group flex flex-col gap-2">
              <span className="aspect-video rounded-xl border border-foreground/10 bg-foreground/3 transition-colors duration-250 group-hover:bg-foreground/10" />
              <span>
                <span className="flex items-center gap-2">
                  {piece.title}
                  <DraftTag status={piece._status} label={copy.draft} />
                </span>
                <span className="block text-caption text-pretty text-foreground/60">{piece.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
