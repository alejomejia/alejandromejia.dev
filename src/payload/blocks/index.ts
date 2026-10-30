import type { Block } from 'payload'

import { BeforeAfter } from './before-after/before-after.config'
import { Callout } from './callout/callout.config'
import { Clip } from './clip/clip.config'
import { CodeBlock } from './code-block/code-block.config'
import { LiveDemo } from './live-demo/live-demo.config'
import { MediaGrid } from './media-grid/media-grid.config'
import { Metrics } from './metrics/metrics.config'
import { Quote } from './quote/quote.config'
import { Steps } from './steps/steps.config'

/**
 * The blocks an editor can drop between paragraphs of a case study or a
 * Writing entry (`storyContent()`), in menu order. They live in the rich
 * text's JSON, so adding or changing one needs no migration.
 */
export const storyBlocks: Block[] = [Clip, BeforeAfter, CodeBlock, Metrics, MediaGrid, Callout, Steps, LiveDemo, Quote]
