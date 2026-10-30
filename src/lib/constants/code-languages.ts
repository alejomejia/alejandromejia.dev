/**
 * Languages a snippet or code block can be highlighted as, keyed by the value
 * stored in the database (Shiki's language ids). Adding a key needs a
 * migration, because snippets store it in a select.
 */
export const CODE_LANGUAGES = {
  tsx: 'TSX',
  ts: 'TypeScript',
  js: 'JavaScript',
  css: 'CSS',
  html: 'HTML',
  vue: 'Vue',
  json: 'JSON',
  bash: 'Shell',
  md: 'Markdown',
} as const satisfies Record<string, string>

export type CodeLanguage = keyof typeof CODE_LANGUAGES

/** `CODE_LANGUAGES` as select options. */
export const CODE_LANGUAGE_OPTIONS = Object.entries(CODE_LANGUAGES).map(([value, label]) => ({ label, value }))
