import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Link } from '@/components/ui/link'
import { enter } from '@/lib/utils'

/**
 * The way back above a page's title ("All work", the case study a chapter
 * belongs to): caption text at `/40`, ink on hover, the arrow nudging left.
 * It enters first.
 */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      {...enter(0, 'group flex w-fit items-center gap-1 text-caption text-foreground/40 transition-colors duration-250 hover:text-foreground')}
    >
      <ArrowLeft aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-250 group-hover:-translate-x-0.5" />
      {children}
    </Link>
  )
}
