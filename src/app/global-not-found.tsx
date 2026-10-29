/* eslint-disable @next/next/no-html-link-for-pages --
 * `global-not-found.tsx` bypasses the router and renders its own document;
 * `next/link` fails to instantiate here, so plain anchors (full navigation)
 * are both required and correct. */
import type { Metadata } from 'next'

import { buttonClassName } from '@/components/ui/button'
import { SITE } from '@/lib/seo/seo.const'
import { fontVariables } from '@/lib/styles/fonts'

// This file bypasses the app's layouts, so it must pull in global styles and
// fonts itself; nothing from `(frontend)/layout.tsx` applies here.
import '@/lib/styles/globals.css'

export const metadata: Metadata = {
  title: `Page not found | ${SITE.name}`,
}

/**
 * App-wide 404 for URLs that match no route at all. Required because the app
 * has multiple root layouts ((frontend) + (payload)), so Next can't compose a
 * global 404 from a single layout. It renders its own `<html>`/`<body>` and
 * therefore has no site Header/Footer; `notFound()` within a route segment
 * still uses the chrome'd `(frontend)/not-found.tsx` instead. Uses plain
 * anchors (not `next/link`): this page bypasses the router, so a full
 * navigation is both correct and required for it to render.
 */
export default function GlobalNotFound() {
  return (
    <html lang={SITE.lang} className={`${fontVariables} antialiased`}>
      <body className="flex min-h-svh flex-col items-center justify-center gap-6 p-8 text-center">
        <a href="/" className="text-lg font-semibold tracking-tight">
          {SITE.name}
        </a>
        <p className="text-sm font-medium uppercase tracking-widest text-foreground/60">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="max-w-md text-base text-foreground/70">
          The page you are looking for doesn&apos;t exist or may have been moved.
        </p>
        <a href="/" className={buttonClassName({ variant: 'solid' })}>
          Back to home
        </a>
      </body>
    </html>
  )
}
