# JSDoc & Comments

Comments earn their place. Be concise; never write a wall of comment text.

## Every exported symbol gets a one-liner

```ts
/** Merges class values and dedupes Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Add `@example` only when the call shape is non-obvious and an example makes it
click faster:

```ts
/**
 * Converts a plain object into a CSS custom-properties map.
 * @example
 * toCSSVars({ gap: 16, color: 'red' }) // { '--gap': '1rem', '--color': 'red' }
 */
export function toCSSVars(vars: Record<string, number | string>) { /* … */ }
```

## Don't document obvious TypeScript

TypeScript already states the shape. Skip `@param` / `@returns` and prop-by-prop
docs unless a parameter's meaning is genuinely non-obvious (a unit, an
invariant, a gotcha).

```ts
// ❌ noise — the types already say this
/**
 * @param title The title
 * @param count The count
 */

// ✅ only the non-obvious part
/** `threshold` is a 0–1 ratio of viewport height, not pixels. */
```

## Comment the "why" of complex code

When logic is not self-evident, add a short inline comment explaining *why* —
the reason a human would otherwise have to reverse-engineer. Not *what* the code
does (the code says that).

```ts
// Measure once before the RAF loop — reading offsetWidth inside it forces a
// reflow on every frame.
const width = el.offsetWidth
```

## Runtime invariants

If a function throws or assumes something, say so with `@throws` or a one-line
note, so callers know the contract.

```ts
/** @throws if called outside a <Header> provider. */
export function useHeaderContext() { /* … */ }
```
