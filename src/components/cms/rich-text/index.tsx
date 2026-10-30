import type { DefaultNodeTypes, DefaultTypedEditorState, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import { type JSXConvertersFunction, RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'

import { Link } from '@/components/ui/link'
import { documentPath, type RoutableCollection } from '@/lib/seo/seo.utils'
import { cn } from '@/lib/utils'

/** Builds the href for an internal rich-text link node. */
function internalDocToHref({ linkNode }: { linkNode: SerializedLinkNode }): string {
  const doc = linkNode.fields.doc
  if (!doc || typeof doc.value !== 'object') return '#'

  const slug = 'slug' in doc.value && typeof doc.value.slug === 'string' ? doc.value.slug : ''
  return documentPath(doc.relationTo as RoutableCollection, slug)
}

// Payload's `LinkJSXConverter` renders plain `<a>`s; these render the
// project's `<Link>`, so internal links route client-side.
const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  autolink: ({ node, nodesToJSX }) => (
    <Link href={node.fields.url ?? ''} newTab={node.fields.newTab ?? undefined}>
      {nodesToJSX({ nodes: node.children })}
    </Link>
  ),
  link: ({ node, nodesToJSX }) => (
    <Link
      href={node.fields.linkType === 'internal' ? internalDocToHref({ linkNode: node }) : (node.fields.url ?? '')}
      newTab={node.fields.newTab ?? undefined}
    >
      {nodesToJSX({ nodes: node.children })}
    </Link>
  ),
})

/**
 * Renders Payload Lexical rich-text content, resolving internal links.
 * `converters` overrides how some nodes render (e.g. a block's own list
 * style), on top of the project's converters.
 */
export function RichText({
  data,
  className,
  converters: overrides,
  unstyled = false,
}: {
  data: DefaultTypedEditorState
  className?: string
  converters?: JSXConvertersFunction<DefaultNodeTypes>
  /** Drops the baseline `.rich-text` styles, for blocks that set their own spacing and lists. @default false */
  unstyled?: boolean
}) {
  const merged: JSXConvertersFunction<DefaultNodeTypes> = overrides
    ? (args) => overrides({ ...args, defaultConverters: converters(args) })
    : converters
  return <ConvertRichText converters={merged} data={data} className={cn(!unstyled && 'rich-text', className)} />
}
