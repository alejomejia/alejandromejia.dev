import { COPY } from '@/lib/constants/copy'
import { cn, formatMessage } from '@/lib/utils'

import { BeforeAfter } from './before-after'
import { Callout } from './callout'
import { Clip } from './clip'
import { CodeBlock } from './code-block'
import { Metrics } from './metrics'
import { Steps } from './steps'
import type { StoryNode } from './story.types'
import { storyHeadingId } from './story.utils'

export type { StoryNode } from './story.types'

// Blocks get a little more room than paragraphs, headings more still.
const BLOCK = 'my-pad-xs'

/**
 * Renders a story (see `StoryNode`) in the content column: h2s, paragraphs
 * and lists in body text, the blocks between them. The page owns the `<h1>`.
 *
 * @example
 * <StoryContent nodes={work.content} />
 */
export async function StoryContent({ nodes, className }: { nodes: StoryNode[]; className?: string }) {
  const copy = COPY.story

  return (
    <div className={cn('flex flex-col gap-pad-s', className)}>
      {nodes.map((node, index) => {
        switch (node.type) {
          case 'heading': {
            const id = storyHeadingId(node.text)
            return (
              // `scroll-mt` keeps a linked heading clear of the viewport's top edge.
              <h2
                key={index}
                id={id}
                className="group relative mt-pad-m scroll-mt-pad-l text-lead font-medium tracking-tight text-balance first:mt-0"
              >
                {node.text}
                {/* A link to the section, shown on hover in the left margin (inline on phones, where there is none). */}
                <a
                  href={`#${id}`}
                  aria-label={formatMessage(copy.anchor, { section: node.text })}
                  className="ml-2 font-mono text-foreground/40 opacity-0 transition-[color,opacity] duration-250 group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100 lg:absolute lg:top-0 lg:-left-6 lg:ml-0"
                >
                  #
                </a>
              </h2>
            )
          }
          case 'paragraph':
            return (
              <p key={index} className="text-pretty text-foreground/80">
                {node.text}
              </p>
            )
          case 'list':
            return (
              <ul key={index} className="flex list-disc flex-col gap-1 pl-5 text-foreground/80 marker:text-foreground/40">
                {node.items.map((item) => (
                  <li key={item} className="text-pretty">
                    {item}
                  </li>
                ))}
              </ul>
            )
          case 'clip':
            return (
              <div key={index} className={BLOCK}>
                <Clip {...node} privateLabel={copy.private} />
              </div>
            )
          case 'beforeAfter':
            return (
              <div key={index} className={BLOCK}>
                <BeforeAfter {...node} labels={{ before: copy.before, after: copy.after, compare: copy.compare }} />
              </div>
            )
          case 'code':
            return (
              <div key={index} className={BLOCK}>
                <CodeBlock {...node} />
              </div>
            )
          case 'callout':
            return (
              <div key={index} className={BLOCK}>
                <Callout text={node.text} label={copy.callout[node.kind]} />
              </div>
            )
          case 'steps':
            return (
              <div key={index} className={BLOCK}>
                <Steps items={node.items} />
              </div>
            )
          case 'metrics':
            return (
              <div key={index} className={BLOCK}>
                <Metrics items={node.items} />
              </div>
            )
        }
      })}
    </div>
  )
}
