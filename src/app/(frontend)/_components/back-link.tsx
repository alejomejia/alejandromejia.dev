import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

import { TextLink } from '@/components/ui/text-link'
import { enter } from '@/lib/utils'

/**
 * The way back above a page's title ("All work", the case study a chapter
 * belongs to): caption text at `/40`; on hover it turns ink, its underline
 * draws and the arrow nudges left (a standalone `TextLink`).
 * It enters first.
 */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <TextLink
      href={href}
      icon={<ArrowLeft strokeWidth={1.5} />}
      iconPosition="start"
      {...enter(0, 'text-caption text-foreground/40')}
    >
      {children}
    </TextLink>
  )
}
