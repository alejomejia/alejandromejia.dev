import 'server-only'

import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

import type { CodeLanguage } from '@/lib/constants/code-languages'
import { ensureContrast, mixColors } from '@/lib/utils'

/** One run of code in one color: `screen` on the dark page, `print` on paper. */
export type CodeToken = { content: string; screen: string; print: string }

// Dracula on screen, the theme Alejandro codes with. It has no light
// version, so paper gets Vitesse's. Swap a name (and its import below) to restyle.
const THEMES = { screen: 'dracula', print: 'vitesse-light' } as const

// The darkest surface code sits on: a highlighted line (`foreground/5`) on
// the code block (`foreground/3`) on the page. The page colors mirror
// `tokens.css` (screen) and its print block (paper).
const SURFACES = {
  screen: mixColors(mixColors('#0f0f0f', '#ededed', 0.03), '#ededed', 0.05),
  print: mixColors(mixColors('#fcfcfc', '#111111', 0.03), '#111111', 0.05),
}

// Results by language and code: the pages render per request, and the same
// snippets come back on every one.
const cache = new Map<string, CodeToken[][]>()
const CACHE_LIMIT = 200

let highlighter: Promise<HighlighterCore> | undefined

/** One highlighter per server process, with only the site's languages and the two themes. */
function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= createHighlighterCore({
    themes: [import('shiki/themes/dracula.mjs'), import('shiki/themes/vitesse-light.mjs')],
    langs: [
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/ts.mjs'),
      import('shiki/langs/js.mjs'),
      import('shiki/langs/css.mjs'),
      import('shiki/langs/html.mjs'),
      import('shiki/langs/vue.mjs'),
      import('shiki/langs/json.mjs'),
      import('shiki/langs/bash.mjs'),
      import('shiki/langs/md.mjs'),
    ],
    // Plain JavaScript regexes: no WebAssembly to load, and fast to start.
    engine: createJavaScriptRegexEngine(),
  })
  return highlighter
}

/**
 * `code` split into lines of colored tokens, for the screen theme and the
 * print theme. Every color is checked against the surface it sits on and
 * nudged to WCAG AA (4.5:1) where a theme falls short (comments, mostly).
 */
export async function highlightCode(code: string, language: CodeLanguage): Promise<CodeToken[][]> {
  const key = `${language}\n${code}`
  const cached = cache.get(key)
  if (cached) return cached

  const { tokens } = (await getHighlighter()).codeToTokens(code, {
    lang: language,
    themes: { screen: THEMES.screen, print: THEMES.print },
    defaultColor: false,
  })
  const lines = tokens.map((line) =>
    line.map((token) => ({
      content: token.content,
      screen: ensureContrast(token.htmlStyle?.['--shiki-screen'] ?? '#ededed', SURFACES.screen),
      print: ensureContrast(token.htmlStyle?.['--shiki-print'] ?? '#111111', SURFACES.print),
    })),
  )

  if (cache.size >= CACHE_LIMIT) cache.clear()
  cache.set(key, lines)
  return lines
}
