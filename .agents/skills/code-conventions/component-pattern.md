# Component Pattern

The canonical layout for a non-trivial component.

## File layout

```
<name>/
├── index.tsx              # root component — the only public entry
├── <name>-<sub>.tsx       # one file per sub-component
├── <name>.hooks.ts        # component-scoped hooks (use-* functions)
├── <name>.const.ts        # module-scoped constants
├── <name>.types.ts        # shared TypeScript types
├── <name>.utils.ts        # pure helpers specific to this component (generic ones → src/lib/utils)
└── <name>.context.ts      # createContext + guard hook (no JSX → .ts)
```

Only create the files you need. A three-line component is just `index.tsx` (or
a single `<name>.tsx` with no folder at all).

## Functions, not arrows

Everything named is a **function declaration**:

```tsx
// ✅
function Header({ nav }: HeaderProps) { /* … */ }
function useHeaderScroll() { /* … */ }
function formatNavLabel(label: string) { /* … */ }

// ❌
const Header = ({ nav }: HeaderProps) => { /* … */ }
const useHeaderScroll = () => { /* … */ }
```

Short **inline callbacks** may stay arrows for readability:

```tsx
items.map((item) => item.label)
<button onClick={() => setOpen(true)} />
```

If an inline callback grows past a couple of lines, lift it to a named
`function` (a handler in the component body or in `<name>.utils.ts`).

## Compound export

When a component has sub-components meant to be composed by the consumer, export
a compound API with `Object.assign` — never a plain object literal (it breaks
tree-shaking and the `<Foo.Bar>` call site).

```tsx
// index.tsx
function CardRoot({ children }: CardProps) { /* … */ }
function CardHeader({ children }: CardHeaderProps) { /* … */ }

export const Card = Object.assign(CardRoot, { Header: CardHeader })
```

Consumers then write `<Card>` / `<Card.Header>`. Do not also export the
sub-components individually — the compound surface is the only API.

Not every folder needs a compound export. Plain sibling sub-components that the
consumer never composes directly (e.g. `header-mobile-menu` used only inside
`Header`) are just imported by `index.tsx` and rendered internally.

## Constants out of JSX

Magic numbers, durations, easings, class-variant tables, storage keys, and
repeated ARIA strings live in `<name>.const.ts` (as `const … as const`), not
inline in the `.tsx`. Types derived from them (`keyof typeof …`) live in
`<name>.types.ts` and `import type` from the const file. Tailwind class strings
inside `cn(...)` stay inline — splitting those hurts readability.

## Client boundary

`'use client'` goes on the leaf that actually needs hooks/refs, not
reflexively on the root. A compound root is often a server component that
renders a client sub-component.

## Imports

`cn()` and `toCSSVars()` come from `@/lib/utils` — never import `clsx` or
`tailwind-merge` directly in a component.
