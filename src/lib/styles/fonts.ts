import { Geist, Geist_Mono } from 'next/font/google'

// Brand faces (see the `alejandromejia-brand` skill): Geist for everything,
// Geist Mono for meta and code. No serif: the wordmark is Geist too.
// Keep the variable names in `theme.css` in step.
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

/**
 * Classes that define the font CSS variables (`--font-geist-sans`, …)
 * consumed by `theme.css`. Put them on `<html>` in every root layout.
 */
export const fontVariables = `${geistSans.variable} ${geistMono.variable}`
