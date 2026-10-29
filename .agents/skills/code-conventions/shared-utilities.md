# Shared Utilities

Generic helpers live in `src/lib/utils/`, not in a component's `<name>.utils.ts`.
Before writing a helper inside a component, check `@/lib/utils`. Before leaving
one there, ask whether it is actually specific to that component.

## The rule

> **If a function knows nothing about the component it sits in, it belongs in
> `src/lib/utils/`.**

A helper is **global** when it doesn't depend on the component's types,
constants, DOM structure, or state, and its name makes sense without the
component's name in front of it. Typical examples are timing/promise helpers,
class/style helpers, math (`clamp`, `lerp`), string/number formatting, and
object/array utilities.

A helper stays **local** (`<name>.utils.ts`) when it reads the component's own
constants or types, encodes its specific behavior, or would need a
component-prefixed name to make sense (`getHeaderOffset`, `buildMarqueeItems`).

```ts
// ❌ header/header.utils.ts — nothing here is about the header
export function wait(ms: number) { /* … */ }

// ✅ lib/utils/async.ts
export function wait(ms: number) { /* … */ }
```

**It does not need a second caller first.** If it is generic, move it the
moment you write it. Waiting for the second use means it gets duplicated
instead of found.

## When you spot one

When you are writing or reviewing code and notice a generic helper inside a
component (or duplicated across components), move it in the same change:

1. Put it in the topic file it belongs to (see below), keeping its JSDoc.
2. Export it from `src/lib/utils/index.ts`.
3. Update every caller to import it from `@/lib/utils`, and delete the local
   copy (and the `<name>.utils.ts` file if it ends up empty).
4. Check that it hasn't also been reimplemented somewhere else under another
   name. If it has, merge the copies.

## Files are grouped by topic

`src/lib/utils/` is split into one file per topic. Never use a catch-all
`helpers.ts`.

| File         | Holds                                                        |
| ------------ | ------------------------------------------------------------ |
| `async.ts`   | promise/timing/loading helpers (`wait`, `waitForWindowLoad`, `preloadImage`) |
| `math.ts`    | numeric/animation math (`clamp`, `frameLerp`)                |
| `styles.ts`  | class names and inline-style helpers (`cn`, `toCSSVars`)      |
| `objects.ts` | object/array helpers (`deepMerge`)                           |
| `scroll.ts`  | scroll input helpers (`blockWheelUntilIdle`)                 |
| `url.ts`     | site URL resolution (`getServerSideURL`, `getClientSideURL`), `withProtocol` |

If a helper fits none of these, create a new topic file (`math.ts`,
`strings.ts`, `dom.ts`, …) rather than forcing it into an unrelated one.

## Keep them environment-honest

Everything in `lib/utils` can be imported from both server and client code, so:

- Helpers that touch `window`/`document` must say **client-only** in their
  JSDoc and must never run at module top level or during render.
- Don't add `'use client'` or server-only imports to a shared utils file. If a
  helper needs either, it belongs in a dedicated module (e.g. `lib/integrations/`,
  or a `.server.ts` file for server-only code; see [server-code.md](./server-code.md)).
- Code outside `lib/utils` imports through the barrel (`@/lib/utils`), never a
  topic file directly (see [barrels.md](./barrels.md)).

## Relation to self-contained components

Importing from `@/lib/utils` is allowed shared infrastructure (see
[self-contained-components.md](./self-contained-components.md)). Moving a
generic helper there doesn't break a component's clean removal. Deleting the
component leaves a still-valid utility behind.
