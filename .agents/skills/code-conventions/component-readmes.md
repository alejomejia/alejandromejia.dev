# Component READMEs

Every **new reusable component** ships with a `README.md` in its own folder.
That means any portable piece under `src/components/`
— effects, UI primitives, layout pieces, block renderers — anything another
project (or another agent) might lift and reuse. One-off, page-local glue that
will never leave this repo does not need one, but when in doubt, write it.

The README is the hand-off document: someone who has never seen the code should
be able to drop the component into a different project from the README alone.

## When to write it

Write the README **in the same change** that creates the component — not later.
A component folder without a README is considered incomplete. When you extend
an existing component, update its README in the same change.

## Where it goes

At the root of the component folder, next to `index.tsx`:

```
src/components/effects/halftone-shape/
├── README.md          ← here
├── index.tsx
└── …
```

## What it must cover

Keep it concise and skimmable (headings + short prose/tables, not an essay).
Cover, in roughly this order:

1. **What it does** — one-paragraph summary, then the notable features/behaviors.
2. **Setup** — exact steps to make it work: where to mount it, any provider,
   required global CSS, required env/config. Copy-pasteable snippets.
3. **Usage** — the common call sites, with code. Show each public API.
4. **Configuration** — props / config options, as a table with defaults.
5. **Where to use it** — good fits and what to avoid.
6. **Dependencies** — libraries and any in-repo modules it relies on (e.g. a
   registered GSAP ease, a util, a context it must live under).
7. **Porting to another project** — the concrete steps to lift it elsewhere,
   including which imports to repoint and which shared setup to recreate. This
   is the point of the rule: the component must be reusable across projects.
8. **Performance / gotchas** — anything non-obvious a maintainer should know.

Omit a section only when it genuinely does not apply. Keep code snippets real
and current — a snippet that no longer compiles is worse than none.

## Style

English only (house rule). Match the tone of existing component READMEs
(`components/effects/gsap`, `components/effects/halftone-shape`). Prefer tables for
props/config. Do not duplicate JSDoc — the README is the how/why/where; JSDoc
is the per-symbol contract.
