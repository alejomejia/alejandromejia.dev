import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

import { TextLink } from '@/components/ui/text-link'

/**
 * The way back above a page's title ("All work", the case study a chapter
 * belongs to): caption text at `text-subtle`; on hover it turns ink, its underline
 * draws and the arrow nudges left (a standalone `TextLink`).
 */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <TextLink
      href={href}
      icon={<ArrowLeft strokeWidth={1.5} />}
      iconPosition="start"
      className="text-caption text-subtle"
    >
      {children}
    </TextLink>
  )
}
