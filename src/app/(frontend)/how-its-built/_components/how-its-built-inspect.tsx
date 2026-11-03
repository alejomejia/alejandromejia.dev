'use client'

import { setInspectEnabled, useInspectEnabled } from '@/components/effects/inspect-mode'
import { TextLink } from '@/components/ui/text-link'
import { COPY } from '@/lib/constants/copy'

/**
 * An inline button in a sentence that turns inspect mode on (and off again),
 * so the page can be measured where it talks about the grid. Inspect mode
 * leaves it clickable.
 */
export function HowItsBuiltInspect({ label }: { label: string }) {
  const enabled = useInspectEnabled()

  return (
    <TextLink
      variant="underline"
      onClick={() => setInspectEnabled(!enabled)}
      aria-pressed={enabled}
      aria-keyshortcuts="I"
      data-inspect-ignore=""
    >
      {enabled ? COPY.howItsBuilt.inspectOff : label}
    </TextLink>
  )
}
