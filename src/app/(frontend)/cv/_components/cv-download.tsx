import { ArrowDown } from 'lucide-react'

import { buttonClassName } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { cn } from '@/lib/utils'

// Both arrows travel one icon height together, like a conveyor: the first
// drops out through the bottom while the second falls in from the top.
const ARROW_CLASSNAME =
  'absolute inset-x-0 top-0 size-4 transition-transform duration-350 ease-out-quint motion-reduce:transition-none'

/**
 * The CV's "Download PDF" link: the brand's button (`buttonClassName`), the
 * label, then the icon. On hover or keyboard focus the arrow drops into its
 * tray and a fresh one falls in behind it, and the tray widens as it lands.
 * Only transforms move, and nothing does under reduced motion.
 */
export function CvDownload({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} newTab className={buttonClassName({ className: 'group' })}>
      {label}
      <span aria-hidden className="relative size-4 overflow-hidden">
        <ArrowDown
          strokeWidth={1.5}
          className={cn(ARROW_CLASSNAME, 'group-hover:translate-y-full group-focus-visible:translate-y-full')}
        />
        <ArrowDown
          strokeWidth={1.5}
          className={cn(
            ARROW_CLASSNAME,
            '-translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0',
          )}
        />
        {/* The tray: narrow at rest, full width once the arrow lands. */}
        <span className="absolute inset-x-0.5 bottom-0 h-px origin-center scale-x-50 bg-current transition-transform delay-100 duration-350 ease-out-quint group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none" />
      </span>
    </Link>
  )
}
