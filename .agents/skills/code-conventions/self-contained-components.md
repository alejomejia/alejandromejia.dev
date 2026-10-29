# Self-Contained Components

Reusable components are **plug-and-play**: adding one means creating its folder
and rendering/mounting it; removing one means deleting its folder and its call
sites — with **no leftovers** in shared files. The site should carry only the
code it actually uses, so a component must not scatter required code into
files it doesn't own.

## The rule

A component owns everything it needs. It must **not** require hand-edits to
shared files to function. Concretely:

- **No global CSS entries.** If a component needs a global style side-effect
  (e.g. `inspect-mode`'s crosshair), it injects a `<style>` at runtime when active
  and removes it on cleanup — it does not add rules to `globals.css`.
- **No shared registries/config edits for its internals.** If a component needs
  a GSAP plugin, custom ease, or similar, it registers that itself in a local
  side-effect module (`<name>.register.ts`) rather than
  appending to the shared `effects/gsap/gsap.register.ts`. Wrap the calls in
  `if (typeof window !== 'undefined')`: registering a headless plugin like
  `useGSAP` wakes GSAP's ticker, which on the server spins a `setTimeout` loop
  forever. Add no `globalThis` once-guard: `gsap.registerPlugin` and
  `CustomEase.create` are idempotent, and a guard only stops edits to the
  module from applying on hot reload.
- **No cross-file constants it alone uses.** Keep them in the component's
  `*.const.ts`.

## What sharing IS allowed

Two forms of coupling are unavoidable and fine, as long as removing the
component means simply deleting these lines:

1. **A mount point.** Something must render the component (a provider in
   `layout.tsx`, a block in a registry). That single call site is expected.
2. **Genuinely shared utilities.** Importing `cn` from `@/lib/utils`, a shared
   hook, or `@/payload-types` is fine — these are project infrastructure, not
   the component's private code living in someone else's file.

The test: **"If I delete this component's folder and its mount line(s), is any
of its code still sitting in a file it doesn't own?"** If yes, move that code
into the component.

## Why

- The site ships only what it uses: a self-contained component is removed
  cleanly by deleting its folder.
- No orphaned CSS rules, dead ease registrations, or config fragments left
  behind when a component is dropped.
- Easier to lift a component into another project (see
  [component-readmes.md](./component-readmes.md) — every README documents its
  porting steps).
