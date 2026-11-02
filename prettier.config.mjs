/**
 * Prettier, matched to how `src/` was already written: no semicolons, single
 * quotes, 120 columns. The Tailwind plugin keeps class lists in Tailwind's
 * order, in `className` and in `cn()` calls.
 *
 * @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions}
 */
const config = {
  semi: false,
  singleQuote: true,
  printWidth: 120,
  trailingComma: 'all',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/lib/styles/globals.css',
  tailwindFunctions: ['cn'],
}

export default config
