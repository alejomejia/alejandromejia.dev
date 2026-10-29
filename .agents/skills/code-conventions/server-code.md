# Server-Only Code

Some modules must never reach the browser. They call the Payload Local API
(`getPayload`), read the request (`next/headers`, `draftMode`), wrap data
loaders in `unstable_cache`, read secrets, or use Node built-ins. Server and
Client Components can import the same module, so nothing stops one of these
from being pulled into a client bundle by accident.

## The rule

A server-only module under `src/lib/` gets **both** markers:

1. **`import 'server-only'`** as its first import. Next turns any import of it
   from client code into a build error. There's nothing to install, because
   Next resolves the package internally.
2. **A `.server.ts` suffix** (`writing.server.ts`, `site-index.server.ts`), so
   every import site shows it: `from '@/lib/cms/writing.server'`.

The two always go together. A `.server.ts` file without the import, or the
import in a file without the suffix, is a bug.

```ts
// lib/cms/writing.server.ts
import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
```

## When not to mark

- **Anything the Payload config loads.** `src/payload/**`, and every module it
  imports directly or indirectly, must not import `server-only`. The Payload
  CLI (`payload migrate` inside `pnpm ci`, `generate:types`, `seed`) loads the
  config in plain Node, where that import throws and breaks the deploy. Their
  location already says "server". If such a module lives in `lib/` (e.g.
  `lib/seo/indexnow.ts`, which a revalidate hook imports), keep the plain name
  and add a one-line comment saying why.
- **Next.js route files** (`page.tsx`, `layout.tsx`, `route.ts`, `sitemap.ts`,
  …). They are server by convention.
- **Components.** Server is the default, and `'use client'` marks the other
  side. A Server Component that imports a `.server.ts` module is already
  guarded through it.
- **Universal modules that happen to run on the server.** Pure builders and
  helpers with no secrets and no server APIs (`seo.utils.ts`, `json-ld.ts`,
  `metadata.ts`, all of `lib/utils`) work in both runtimes. Leave them
  unmarked so either side can use them.

## Never behind a barrel

A `.server.ts` module is always imported by its own path. It is never
re-exported from an `index.ts` (see [barrels.md](./barrels.md)).

## Review checklist

Run on every change that adds or moves server code. Every command should print
nothing.

```sh
# A .server.ts file without the import
rg --files-without-match "^import 'server-only'" -g '*.server.ts' src

# The import in a file without the suffix
rg -l "^import 'server-only'" -g '!*.server.ts' src

# Payload importing a .server module directly (the CLI would crash)
rg -n "\.server'" src/payload

# A client file importing a .server module (Next also fails the build on this)
rg -U -l "(?s)\A'use client'.*\.server'" src
```

The third check only catches direct imports. After changing anything that
Payload imports, run `pnpm payload migrate:status`. It loads the config the
same way `pnpm ci` does, so an indirect `server-only` import fails there first.
