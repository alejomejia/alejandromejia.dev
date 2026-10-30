import type { ReactNode } from 'react'

import { HalftoneShape } from '@/components/effects/halftone-shape'
import { BeforeAfter } from '@/components/story/before-after'
import { MediaFrame } from '@/components/story/media-frame'
import { COPY } from '@/lib/constants/copy'

import { CraftDemoInspect } from './craft-demo-inspect'
import { CraftStage } from './craft-stage'
import type { CraftDemoKey, CraftExperiment } from './craft.types'

/**
 * The live demos, by key. Each renders its whole stage, since some (the
 * slider) bring their own frame. Demos are code, not CMS content: an entry
 * picks one by key.
 */
const CRAFT_DEMOS: Record<CraftDemoKey, () => ReactNode> = {
  'inspect-mode': () => <CraftDemoInspect copy={COPY.craft.inspect} />,
  'halftone-shape': () => (
    <CraftStage>
      <HalftoneShape speed={0.8} className="absolute inset-0" />
    </CraftStage>
  ),
  'before-after': () => (
    <BeforeAfter
      before={{}}
      after={{}}
      labels={{ before: COPY.story.before, after: COPY.story.after, compare: COPY.story.compare }}
    />
  ),
}

/**
 * An experiment's live demo. Without one yet, its recording stands in, or
 * the dot texture until there is a recording.
 */
export function CraftDemo({ entry }: { entry: Pick<CraftExperiment, 'demo' | 'fallback'> }) {
  if (entry.demo) return CRAFT_DEMOS[entry.demo]()
  return <MediaFrame media={entry.fallback} />
}
