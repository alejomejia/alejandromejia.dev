import { queryProfileIntro } from '@/lib/cms/profile.server'

/**
 * The one-line intro, at the bottom of the sidebar above the footer's links:
 * the top stays for who and where to go. Renders nothing without an intro.
 */
export async function SidebarIntro() {
  const { intro } = await queryProfileIntro()
  if (!intro) return null

  return <p className="text-caption text-pretty text-foreground/60">{intro}</p>
}
