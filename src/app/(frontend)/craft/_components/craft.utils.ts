import { CODE_LANGUAGES } from '@/lib/constants/code-languages'

import type { CraftSnippet } from './craft.types'

/** The languages a snippet is written in, in file order, once each: "TSX · CSS". */
export function snippetLanguages(snippet: Pick<CraftSnippet, 'files'>): string {
  return [...new Set(snippet.files.map((file) => CODE_LANGUAGES[file.language]))].join(' · ')
}
