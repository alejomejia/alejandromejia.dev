# Imports

Use the configured path aliases. **Never traverse up the tree with `../`.**

## The rule

**Never write `../`.** That's the whole rule — no ascending traversal.

- **`./` for the current folder and folders beneath it.** Siblings and
  companion files (`./header-nav`, `./content.const`) and an aggregation root
  reaching into its own subfolders (e.g. `payload.config.ts` importing
  `./collections/pages`) use `./`.
- **`@/…` for anything you'd otherwise reach with `../`.** Crossing to another
  part of the app is always the alias — the tsconfig paths exist for exactly
  this:
  - `@/*` → `src/*`
  - `@payload-config` → `src/payload/payload.config.ts`

```ts
// ✅ same folder
import { HeaderNav } from './header-nav'
import { COLUMN_WIDTH } from './content.const'

// ✅ crossing folders — always the alias
import { link } from '@/payload/fields/link'
import { cn } from '@/lib/utils'
import type { Page } from '@/payload-types'

// ❌ never
import { link } from '../../fields/link'
import { cn } from '../../../lib/utils'
```

## Why

- Files read the same no matter how deeply they're nested; moving a file
  doesn't rewrite its imports.
- `Cmd-P` and grep for `@/payload/fields/link` find every consumer; `../../` is
  invisible to search.
- It removes the "how many `../` do I need?" guesswork.

## The one exception

The Payload-generated `src/app/(payload)/**` route files (marked *"GENERATED
AUTOMATICALLY BY PAYLOAD … DO NOT MODIFY"*) use relative imports like
`../importMap` by design and are rewritten by Payload. Leave them as-is.

## Enforcement

Deep-relative imports should return nothing outside the generated routes:

```sh
rg "from '\.\./" src --glob '!src/app/(payload)/**'
```
