import { AvailabilityDot } from '@/components/layout/availability-dot'
import { CommandMenu, CommandMenuTrigger } from '@/components/layout/command-menu'
import { Link } from '@/components/ui/link'
import { LocalClock } from '@/components/ui/local-clock'
import { Logo } from '@/components/ui/logo'
import { queryHeader } from '@/lib/cms/header.server'
import type { NavLink } from '@/lib/cms/links'
import { queryProfileIntro } from '@/lib/cms/profile.server'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { cn } from '@/lib/utils'

import { HeaderNav } from './header-nav'

/**
 * The top of the sidebar (see `Sidebar`): who Alejandro is and the menu,
 * always in view. The wordmark and headline, the intro, the availability line
 * and the live clock (Profile global), then the menu: Home, the Header
 * global's links and CV. On phones it stacks above the page with the menu as
 * a row, and the command menu's trigger ("Menu") sits beside the wordmark.
 * Mounts the command menu once for the whole site.
 */
export async function Header({ className }: { className?: string }) {
  const [{ navItems }, profile] = await Promise.all([queryHeader(), queryProfileIntro()])
  const copy = COPY.header
  const menu: NavLink[] = [
    { label: copy.home, href: SITE_ROUTES.home },
    ...navItems,
    { label: copy.cv, href: SITE_ROUTES.cv },
  ]

  return (
    <header className={cn('flex flex-col gap-pad-l', className)}>
      <div className="flex flex-col gap-pad-s">
        <div className="flex items-start justify-between gap-6">
          <div>
            <Link href={SITE_ROUTES.home} prefetch="viewport">
              <Logo />
            </Link>
            <p className="text-foreground/40">{profile.headline}</p>
          </div>
          <CommandMenuTrigger className="lg:hidden" />
        </div>

        {profile.intro && <p className="text-pretty text-foreground/60">{profile.intro}</p>}

        {(profile.available || profile.timezone) && (
          <div className="flex flex-col gap-1 text-caption">
            {profile.available && (
              <p className="flex gap-2 text-foreground/60">
                {/* On the first line's center when the status wraps. */}
                <AvailabilityDot className="mt-[calc(0.5lh-0.25rem)]" />
                {profile.availability ?? copy.available}
              </p>
            )}
            {profile.timezone && (
              <p
                title={profile.location ? copy.localTime.replace('{place}', profile.location) : undefined}
                className={cn('text-foreground/40', profile.available && 'pl-4')}
              >
                {profile.location && `${profile.location} · `}
                <LocalClock timeZone={profile.timezone} />
              </p>
            )}
          </div>
        )}
      </div>

      <HeaderNav navItems={menu} label={copy.nav} />
      <CommandMenu navItems={navItems} />
    </header>
  )
}
