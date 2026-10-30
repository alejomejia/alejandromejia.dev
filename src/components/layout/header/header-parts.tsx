import { AvailabilityDot } from '@/components/layout/availability-dot'
import { CommandMenuTrigger } from '@/components/layout/command-menu'
import { Link } from '@/components/ui/link'
import { LocalClock } from '@/components/ui/local-clock'
import { Logo } from '@/components/ui/logo'
import type { ProfileIntro } from '@/lib/cms/profile.server'
import { COPY } from '@/lib/constants/copy'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { cn, formatMessage } from '@/lib/utils'

/** The wordmark (linking home) and the headline, with the ⌘K trigger beside them on phones. */
export function HeaderIdentity({ profile, className }: { profile: ProfileIntro; className?: string }) {
  return (
    <div className={cn('flex items-start justify-between gap-6', className)}>
      <div>
        <Link href={SITE_ROUTES.home} prefetch="viewport">
          <Logo />
        </Link>
        <p className="text-foreground/40">{profile.headline}</p>
      </div>
      <CommandMenuTrigger className="lg:hidden" />
    </div>
  )
}

/**
 * The status as one mono line: the dot and "Open to work" (while it is on),
 * the town (the first part of the location) and the time there. The full
 * availability sentence is its tooltip, the clock's says whose time it is.
 */
export function HeaderByline({ profile, className }: { profile: ProfileIntro; className?: string }) {
  const copy = COPY.header
  const town = profile.location?.split(',')[0]
  const parts = [
    town,
    profile.timezone && (
      <span title={profile.location ? formatMessage(copy.localTime, { place: profile.location }) : undefined}>
        <LocalClock timeZone={profile.timezone} />
      </span>
    ),
  ].filter(Boolean)

  return (
    <p
      title={(profile.available && profile.availability) || undefined}
      className={cn('flex items-center gap-x-2 font-mono text-micro whitespace-nowrap text-foreground/40', className)}
    >
      {profile.available && (
        <>
          <AvailabilityDot />
          <span className="text-foreground/60">{copy.available}</span>
        </>
      )}
      {parts.map((part, index) => (
        <span key={index} className="flex items-center gap-x-2">
          {(profile.available || index > 0) && <span aria-hidden>·</span>}
          {part}
        </span>
      ))}
    </p>
  )
}
