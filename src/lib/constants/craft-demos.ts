/**
 * Live demos a Craft entry or a "Live demo" block can show, keyed by the value
 * stored in the database. Demos are code, not CMS content: each key maps to a
 * component in the Craft demo registry (Phase 7). Adding a key also needs a
 * migration, because the Craft collection stores it in a select.
 */
export const CRAFT_DEMOS = {
  'halftone-shape': { label: 'Halftone morph (the home page loop)' },
  'page-transition': { label: 'Blur page transition' },
} as const satisfies Record<string, { label: string }>

export type CraftDemo = keyof typeof CRAFT_DEMOS

/** `CRAFT_DEMOS` as select options. */
export const CRAFT_DEMO_OPTIONS = Object.entries(CRAFT_DEMOS).map(([value, { label }]) => ({ label, value }))
