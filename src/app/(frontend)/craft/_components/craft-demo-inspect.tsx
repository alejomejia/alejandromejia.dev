'use client'

import { setInspectEnabled, useInspectEnabled } from '@/components/effects/inspect-mode'
import type { Copy } from '@/lib/constants/copy'

import { CraftStage } from './craft-stage'

/**
 * Inspect mode's demo: a small card to measure, and a button that turns the
 * site-wide inspector on and off (it stays clickable while inspecting).
 */
export function CraftDemoInspect({ copy }: { copy: Copy['craft']['inspect'] }) {
  const enabled = useInspectEnabled()

  return (
    <figure className="flex flex-col gap-pad-xs">
      <CraftStage>
        {/* No border: inspect mode measures from the outer edge, and a 1px
            border would push every distance off the grid (25 instead of 24). */}
        <div className="flex w-64 flex-col gap-pad-xs rounded-xl bg-background p-pad-m">
          <p className="font-medium">{copy.cardTitle}</p>
          <p className="text-caption text-pretty text-foreground/60">{copy.cardText}</p>
          <span className="mt-pad-xs inline-flex h-8 w-fit items-center rounded-lg border border-foreground/10 px-3 text-caption">
            {copy.cardAction}
          </span>
        </div>
      </CraftStage>
      <figcaption className="flex flex-col gap-pad-xs text-caption text-foreground/60 sm:flex-row sm:items-center sm:gap-pad-s">
        <button
          type="button"
          onClick={() => setInspectEnabled(!enabled)}
          aria-pressed={enabled}
          aria-keyshortcuts="I"
          data-inspect-ignore=""
          className="inline-flex h-8 w-fit shrink-0 cursor-pointer items-center rounded-lg border border-foreground/10 px-3 text-foreground transition-colors duration-250 hover:bg-foreground/3"
        >
          {enabled ? copy.off : copy.on}
        </button>
        <span className="text-pretty">{copy.hint}</span>
      </figcaption>
    </figure>
  )
}
