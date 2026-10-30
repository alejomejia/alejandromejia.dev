import type { CollectionConfig } from 'payload'

/**
 * Drafts with autosave, for collections edited in live preview. Autosave fires
 * once the editor pauses for `interval` ms; each save rewrites the draft (every
 * block and array row) and re-renders the preview page, so the pause is
 * a real one rather than the gap between keystrokes.
 */
export const autosaveVersions = {
  drafts: {
    autosave: { interval: 1000 },
  },
  maxPerDoc: 50,
} satisfies CollectionConfig['versions']
