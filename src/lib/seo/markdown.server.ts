import 'server-only'

import configPromise from '@payload-config'
import {
  convertLexicalToMarkdown,
  editorConfigFactory,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'

import type {
  BeforeAfterBlock,
  CalloutBlock,
  ClipBlock,
  CodeBlock,
  LiveDemoBlock,
  MediaGridBlock,
  MetricsBlock,
  QuoteBlock,
  StepsBlock,
  Writing,
} from '@/payload-types'

/** The blocks an editor can drop into a story's rich text (`storyContent()`). */
type StoryBlock =
  | ClipBlock
  | BeforeAfterBlock
  | CodeBlock
  | MetricsBlock
  | MediaGridBlock
  | CalloutBlock
  | StepsBlock
  | LiveDemoBlock
  | QuoteBlock

const CALLOUT_LABELS: Record<CalloutBlock['kind'], string> = { note: 'Note', lesson: 'Lesson', tradeoff: 'Trade-off' }

// Built once per server. Lexical's full default feature set (not the slimmer
// project default) so every node an editor can produce (headings, lists,
// quotes, links) has a Markdown transformer.
let editorConfigPromise: ReturnType<typeof editorConfigFactory.fromFeatures> | undefined

function getEditorConfig() {
  editorConfigPromise ??= configPromise.then((config) =>
    editorConfigFactory.fromFeatures({ config, features: ({ defaultFeatures }) => defaultFeatures }),
  )
  return editorConfigPromise
}

function isRichText(value: unknown): value is DefaultTypedEditorState {
  return typeof value === 'object' && value !== null && 'root' in value
}

/**
 * Walks a value's fields and collects its text in document order: `heading`
 * strings become `##` headings, rich-text fields become Markdown. Generic on
 * purpose so new fields are picked up without touching this file.
 */
async function blockToMarkdown(value: unknown): Promise<string[]> {
  if (isRichText(value)) {
    const markdown = convertLexicalToMarkdown({ data: value, editorConfig: await getEditorConfig() })
    return markdown.trim() ? [markdown.trim()] : []
  }
  if (Array.isArray(value)) {
    return (await Promise.all(value.map(blockToMarkdown))).flat()
  }
  if (typeof value !== 'object' || value === null) return []

  const parts: string[] = []
  for (const [key, field] of Object.entries(value)) {
    // Uploads and link targets carry no readable page copy.
    if (['media', 'poster', 'link', 'links', 'id', 'blockType', 'blockName'].includes(key)) continue
    if (key === 'heading' && typeof field === 'string' && field.trim()) {
      parts.push(`## ${field.trim()}`)
      continue
    }
    parts.push(...(await blockToMarkdown(field)))
  }
  return parts
}

/** A fenced Markdown code block. */
function fence(code: string, language?: string | null): string {
  return `\`\`\`${language ?? ''}\n${code}\n\`\`\``
}

/** A story block's readable text as Markdown; media-only blocks keep just their caption. */
function storyBlockToMarkdown(block: StoryBlock): string[] {
  switch (block.blockType) {
    case 'codeBlock':
      return [fence(block.code, block.language)]
    case 'callout':
      return [`> **${CALLOUT_LABELS[block.kind]}:** ${block.text}`]
    case 'metrics':
      return [block.items.map(({ value, label }) => `- **${value}** ${label}`).join('\n')]
    case 'steps':
      return [
        block.items.map(({ title, text }, index) => `${index + 1}. **${title}**${text ? ` ${text}` : ''}`).join('\n'),
      ]
    case 'quote': {
      const recommendation = typeof block.recommendation === 'object' ? block.recommendation : null
      if (!recommendation) return []
      const who = [recommendation.name, recommendation.role, recommendation.company].filter(Boolean).join(', ')
      return [`> ${recommendation.quote.replace(/\n+/g, '\n> ')}\n>\n> *${who}*`]
    }
    default:
      return block.caption ? [`*${block.caption}*`] : []
  }
}

/**
 * A story's rich text (`storyContent()`) as Markdown. Lexical's Markdown
 * export doesn't know the story blocks, so runs of ordinary nodes go through
 * it and each block is written by {@link storyBlockToMarkdown}, in order.
 */
async function storyToMarkdown(value: unknown): Promise<string[]> {
  if (!isRichText(value)) return []
  // The default editor types don't include block nodes, so read the children loosely.
  const { root } = value as unknown as { root: { children: { type: string; fields?: unknown }[] } }

  const parts: string[] = []
  let run: typeof root.children = []

  async function flush() {
    if (run.length === 0) return
    parts.push(...(await blockToMarkdown({ root: { ...root, children: run } })))
    run = []
  }

  for (const node of root.children) {
    if (node.type === 'block' && node.fields) {
      await flush()
      parts.push(...storyBlockToMarkdown(node.fields as StoryBlock))
    } else {
      run.push(node)
    }
  }
  await flush()
  return parts
}

/** A Writing entry as Markdown: a snippet's why and code, then the body. */
export async function writingToMarkdown(entry: Writing): Promise<string> {
  const snippet = entry.format === 'snippet' ? [entry.why, entry.code && fence(entry.code, entry.language)] : []
  return [...snippet.filter((part): part is string => Boolean(part)), ...(await storyToMarkdown(entry.content))].join(
    '\n\n',
  )
}
