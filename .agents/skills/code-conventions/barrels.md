# Barrels

A **barrel** is an `index.ts` whose only job is to re-export other files
(`lib/utils/index.ts`, `lib/hooks/index.ts`). A component folder's `index.tsx`
is **not** a barrel. It holds the component itself, so importing it costs
nothing extra.

## How a barrel costs you

Writing a barrel and importing from it are the same thing seen from two sides.
The cost lands on whoever imports it, and it depends on what sits behind it:

- **Dev server, Payload CLI, tests:** there is no tree-shaking. Importing `cn`
  from `@/lib/utils` loads and compiles *every* module the barrel re-exports,
  plus their dependencies.
- **Production build:** Turbopack drops unused exports, but only from modules
  it can prove are side-effect free.
- **Mixed runtimes:** if one member is server-only, every client file that
  imports the barrel pulls it toward the browser bundle (a build error at best).
- **Cycles:** a module that imports its own barrel can see `undefined` (or
  "Cannot access X before initialization") at load time.

So small, focused, side-effect-free barrels are fine, and big catch-all
barrels are what to avoid. "Barrel exports good, barrel imports bad" is the
wrong split.

```ts
// lib/utils/index.ts — the public surface of the utils domain
export { wait, waitForWindowLoad, preloadImage } from './async'
export { cn, toCSSVars } from './styles'
```

```ts
// consumer
import { cn } from '@/lib/utils'
```

## Rules

1. **Only for a domain's public surface.** A barrel is allowed on a `lib/`
   domain that the rest of the app consumes (`lib/utils`, `lib/hooks`). If an
   `index.ts` exists only so callers can type a shorter path, delete it.
2. **Never a mega-barrel.** No `components/index.ts`, `lib/index.ts`, or any
   barrel that re-exports across feature boundaries.
3. **Never barrel a component's internals.** A component's `index.tsx` is its
   only public entry. After an `Object.assign` compound export, there is no
   extra `index.ts` re-exporting sub-components.
4. **One barrel, one runtime.** Every member must be safe everywhere the
   barrel is imported. `lib/utils` is universal (server and client), and
   `lib/hooks` is client (`'use client'`). Never re-export a `.server.ts`
   module, or anything that imports `server-only`, `next/headers`, `payload`
   or Node built-ins (see [server-code.md](./server-code.md)).
5. **Light and side-effect free.** Members only declare things. Nothing runs
   at module top level: no `gsap.registerPlugin`, listeners, CSS imports or
   `window` access. A module that needs a heavy dependency (a parser, an SDK,
   a big library) gets its own folder and is imported directly. Don't add it
   to a barrel that every component loads.
6. **No cycles.** `lib/utils` is a leaf and imports nothing from `@/…`. Other
   barrel domains may import `@/lib/utils`. A module never imports its own
   barrel; inside the folder, siblings use `./file`.
7. **One import path per symbol.** Code outside a barrel's folder always goes
   through the barrel (`@/lib/utils`), never a deep path (`@/lib/utils/url`).
   A new public function is exported from the `index.ts` in the same change.
   Anything left out of it is private to the folder.

## The test

A barrel is fine when importing one symbol from it costs about the same as
importing that symbol's file directly. That holds when its members are few,
light, side-effect free and safe in the same runtime.

## Review checklist

Run on every change that adds an `index.ts`, touches `lib/utils` or
`lib/hooks`, or adds an import from them. Every command except the first
should print nothing.

```sh
# Every barrel in src/. Today: lib/utils, lib/hooks. A new one must pass rules 1–7.
rg -l -g '**/index.ts' '^export .* from' src

# Rule 4: no server-only code behind a barrel
rg -n "server-only|next/headers|from 'payload'|from 'node:|\.server'" src/lib/utils src/lib/hooks

# Rule 5: no module-level side effects (expect only function/const/type declarations)
rg -n "^(gsap\.|window\.|document\.|import '|import \")" src/lib/utils src/lib/hooks

# Rule 6: lib/utils is a leaf; no domain imports its own barrel
rg -n "from '@/" src/lib/utils
rg -n "from '@/lib/hooks'" src/lib/hooks

# Rule 7: no deep imports past a barrel
rg -n "from '@/lib/(utils|hooks)/" src
```
