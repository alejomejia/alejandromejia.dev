import { storyHeadings } from '@/components/story/story.utils'
import type { StoryNode } from '@/components/story'
import { Link } from '@/components/ui/link'
import { SectionLabel } from '@/components/ui/section-label'

type WritingContentsProps = {
  nodes: StoryNode[]
  label: string
}

// Fewer sections than this read fine without a table of contents.
const MIN_HEADINGS = 3

/**
 * The article's sections, numbered like a case study's chapters, each
 * linking to its heading on the page. Renders nothing for a short article.
 */
export function WritingContents({ nodes, label }: WritingContentsProps) {
  const headings = storyHeadings(nodes)
  if (headings.length < MIN_HEADINGS) return null

  return (
    <nav aria-label={label}>
      <SectionLabel>{label}</SectionLabel>
      <ol className="mt-pad-xs flex flex-col">
        {headings.map((heading, index) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className="group -mx-2 flex items-baseline gap-4 rounded-lg px-2 py-1 text-muted transition-colors duration-250 hover:bg-foreground/3 hover:text-foreground"
            >
              <span className="font-mono text-micro text-subtle">{String(index + 1).padStart(2, '0')}</span>
              {heading.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
