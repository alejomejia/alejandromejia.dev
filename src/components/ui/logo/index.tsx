import { SITE } from '@/lib/seo/seo.const'
import { cn } from '@/lib/utils'

/**
 * The site logo: the name as the wordmark, Geist at 500, lead size, tight
 * tracking, in ink. Weight, size and contrast with the `/40` headline under
 * it set it apart, not a second typeface. It inherits `currentColor` and is
 * not a link: wrap it in `Link` where it should go home.
 */
export function Logo({ className }: { className?: string }) {
  return <span className={cn('text-lead font-medium tracking-tight', className)}>{SITE.name}</span>
}
