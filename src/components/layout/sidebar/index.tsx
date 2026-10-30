import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

/**
 * The site's chrome: on large screens a column fixed to the left of the
 * content (sticky, the viewport's height), the header at its top and the
 * footer at its bottom, so who Alejandro is, the menu and the links are
 * always in view. Below `lg` the wrapper has no box (`contents`): the header
 * opens the page and the footer closes it, around `<main>` (`order-2`, see
 * the frontend layout).
 *
 * It names its own view transition snapshot (on phones, the header does), so
 * it stays still while the page content changes.
 */
export function Sidebar() {
  return (
    <div className="contents lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-between lg:gap-pad-xl lg:self-start lg:py-pad-xl lg:[view-transition-name:sidebar]">
      <Header className="order-1 pt-pad-l max-lg:[view-transition-name:sidebar] lg:pt-0" />
      <Footer className="order-3 pb-pad-l lg:pb-0" />
    </div>
  )
}
