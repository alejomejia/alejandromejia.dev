import { defineConfig } from 'vitest/config'

/**
 * Unit tests for pure logic (formatting, URLs, search ranking, layout math),
 * next to the code they test as `*.test.ts`. They run in Node: anything that
 * needs a real browser belongs in an end-to-end test instead.
 */
export default defineConfig({
  // Resolves `@/…` from tsconfig.json, like Next does.
  resolve: { tsconfigPaths: true },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
