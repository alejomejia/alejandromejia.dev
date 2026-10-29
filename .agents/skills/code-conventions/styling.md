# Styling (Tailwind & CSS)

Applies whenever you write class names, CSS files or inline `style`. Three rules:
**every pixel value sits on the 8px grid and is written in `rem`**,
**square brackets are a last resort**, since Tailwind v4 accepts most values
bare, and **no raw inline CSS**: runtime values reach CSS only as variables
from `toCSSVars`. Everything below was verified against the Tailwind v4 compiler.

## 1. The 8px grid, in rem

- **Allowed pixel values:** multiples of 8 (8, 16, 24, 32, 40, 48…), plus
  **1, 2, 4 and 12**. Nothing else.
- **Round design values to the nearest allowed value; on a tie, round up.**
  30 → 32, 18 → 16, 44 → 48, 10 → 12, 20 → 24, 5 → 4.
- **Write lengths in `rem`, never `px`** (rem = px ÷ 16). Projects may scale
  the root font-size fluidly, and rem keeps the whole UI scaling together.
- **On Tailwind's spacing scale the class number is px ÷ 4** (`--spacing` is
  `0.25rem`). Allowed numbers are `0.25`, `0.5`, `1`, `3` and every even
  number. Odd numbers from 5 up (`p-5` = 20px, `gap-7` = 28px) and other
  decimals (`gap-1.5` = 6px, `py-2.5` = 10px) are off-grid.

| px | rem | class | | px | rem | class |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.0625 | `*-0.25` | | 32 | 2 | `*-8` |
| 2 | 0.125 | `*-0.5` | | 40 | 2.5 | `*-10` |
| 4 | 0.25 | `*-1` | | 48 | 3 | `*-12` |
| 8 | 0.5 | `*-2` | | 64 | 4 | `*-16` |
| 12 | 0.75 | `*-3` | | 80 | 5 | `*-20` |
| 16 | 1 | `*-4` | | 120 | 7.5 | `*-30` |
| 24 | 1.5 | `*-6` | | 448 | 28 | `*-112` |

**What it covers:** every fixed length, meaning padding, margin, gap, width,
height, size, min/max, inset/top/left, translate, basis, radius, blur and fixed
line-heights. The same rule holds in `.css` files and in values passed to
`toCSSVars`: write `2rem`, not `32px` or `30px`.

**Annotate rem with its px value in `.css` files.** Every line that uses a
`rem` value ends with a comment giving the px equivalent at a 16px root
(rem × 16), so the design value is readable at a glance. The value itself stays
in rem. List every value when a line has several. Use `/* */`: `//` is not a
CSS comment and breaks the next declaration.

```css
--spacing-pad-xs: 0.75rem; /* 12px */
padding: 0.5rem 1.5rem; /* 8px, 24px */
@media (max-width: 30rem) { /* 480px */
```

**What it doesn't cover:** font sizes (see Typography below), relative units
(`%`, fractions, `vw`/`vh`/`dvh`, `em`) and unitless values (line-height
ratios, opacity, scale), since they aren't pixel values.

**Exceptions:**

- **Hairlines stay in px.** Tailwind emits `border`, `border-2`, `ring-1`,
  `outline-2`, `divide-x`, `underline-offset-2` and `*-px` in px on purpose,
  so keep them. A rem hairline can round to zero when the root font-size
  scales down. These still use only 1, 2, 4 or 8, never `border-3`. The same
  goes for a px floor that keeps a tiny mark visible:
  `size-[max(0.25rem,4px)]`.
- **The root font-size is px** (`html { font-size: clamp(10px, …) }`), since
  it is what defines `rem`.
- **Font sizes are off the grid, but only through `text-*` tokens.** The type
  scale follows the design (a 10px caption must stay smaller than 12px body
  text). Components use the project's tokens (`text-body`, `text-display-m`,
  which carry their line-heights) or Tailwind's default scale (`text-sm`),
  never `text-[0.625rem]`. A size with no token gets one: add `--fs-<name>` to
  `src/lib/styles/tokens.css`, map it as `--text-<name>` in `theme.css`, and
  add the name to the `extendTailwindMerge` list in `src/lib/utils/styles.ts`.
  Without that last step, `cn()` reads `text-<name>` as a color and drops the
  real color class.
- **Project tokens win.** If the project's `@theme` (`src/lib/styles/theme.css`)
  defines a spacing or color token for the value, use it (`p-pad-s`, `bg-foreground`,
  `ease-out-expo`). New tokens follow this doc too: rem, on the grid.

## 2. Brackets are a last resort

Pick the first form that works:

1. **A token or named utility:** `text-body`, `p-pad-s`, `bg-foreground`,
   `aspect-video`, `w-full`, `h-dvh`, `leading-none`, `origin-top-left`.
2. **A bare value.** Tailwind v4 computes these, so **any number works**, not
   just the old v3 scale (`w-17`, `max-w-200`, `z-60` are all valid).
3. **CSS variable shorthand:** `w-(--thumb-size)`, not `w-[var(--thumb-size)]`.
   When the type is ambiguous, add a hint: `text-(length:--fs)`,
   `text-(color:--brand)`.
4. **Brackets**, only when none of the above exists. The value inside still
   follows the grid and rem rules: `w-[calc(100%-2rem)]`, not
   `w-[calc(100%-30px)]`.

| Need | ✅ Write | ❌ Not |
| --- | --- | --- |
| Ratio 2:3 | `aspect-2/3` | `aspect-[2/3]` |
| 32px | `w-8`, `size-8`, `gap-8` | `w-[32px]`, `w-[2rem]` |
| 448px max width | `max-w-112` | `max-w-[28rem]` |
| Percent of parent | `w-1/3`, `basis-1/4`, `top-1/2`, `-translate-y-1/2`, `translate-x-full` | `w-[33.333%]`, `translate-x-[100%]` |
| Viewport units | `h-dvh`, `h-svh`, `w-screen` | `h-[100dvh]`, `w-[100vw]` |
| z-index / order | `z-60`, `order-7` | `z-[60]`, `order-[7]` |
| Opacity / alpha | `opacity-35`, `bg-black/37` | `opacity-[.35]`, `bg-black/[.37]` |
| Grid | `grid-cols-15`, `grid-rows-7`, `col-span-7`, `col-start-13` | `grid-cols-[repeat(15,minmax(0,1fr))]` |
| Timing | `duration-350`, `delay-120` | `duration-[350ms]` |
| Transforms | `scale-115`, `scale-x-20`, `-scale-x-100`, `rotate-15`, `skew-x-6` | `scale-[1.15]`, `scale-x-[-1]`, `rotate-[15deg]` |
| Filters | `brightness-80`, `contrast-125`, `hue-rotate-30` | `brightness-[.8]` |
| Fixed line-height | `leading-6` (24px) | `leading-[24px]`, `leading-[1.5rem]` |
| Hairline widths | `border-2`, `ring-1`, `outline-2`, `underline-offset-2` | `border-[2px]` |
| Misc integers | `columns-3`, `line-clamp-4`, `stroke-2` | `columns-[3]` |
| CSS variable | `bg-(--brand)`, `w-(--size)` | `bg-[var(--brand)]` |

**No bare numeric form, so use tokens or brackets:** font-size (`text-*`
tokens), font-weight (`font-medium`…), letter-spacing (`tracking-tight`…),
radius (`rounded-*`), blur and shadows (Tailwind's `blur-*`/`shadow-*` keys
are px, so write rem: `blur-[2rem]`, `shadow-[0_0.25rem_2rem_…]`), unitless line-height
(`leading-[1.1]`), `calc()`/`max()`, multi-value (`origin-[50%_25%]`), combined
transitions (`transition-[opacity,transform]`) and arbitrary properties
(`[mask-type:luminance]`).

Not sure whether a utility takes bare values? Open its page on
tailwindcss.com and check the quick-reference table. If it lists
`<utility>-<number>`, `-<fraction>` or `-<ratio>`, you don't need brackets.

## 3. No raw inline CSS: `toCSSVars` + Tailwind

Never write CSS properties in a `style` prop (`style={{ color }}`,
`style={{ opacity: 0 }}`). Styling stays in class names, where it is
greppable, merged by `cn()` and themed by tokens.

- **Static values are classes.** An initial state is a class too
  (`opacity-0`, `invisible`, `translate-y-full`); the inline style that
  GSAP or a frame loop writes later overrides it.
- **Runtime values (props, CMS data, computed) are CSS variables.** Pass them
  through `toCSSVars` from `@/lib/utils`, and read them with Tailwind's
  `(--name)` shorthand. `toCSSVars` turns numbers into rem (px ÷ 16), so pass
  unitless values (opacity, scale) as strings, and it drops `null` and
  `undefined`.

  ```tsx
  <span
    className="bg-(--overlay-color) opacity-(--overlay-opacity)"
    style={toCSSVars({ 'overlay-color': hex, 'overlay-opacity': String(opacity) })}
  />
  <Image className="object-cover object-(--focal-point)" style={toCSSVars({ 'focal-point': image.position })} />
  <div className="h-(--stage-height)" style={toCSSVars({ 'stage-height': `${slots * 100}vh` })} />
  <div className="bg-(image:--fade)" style={toCSSVars({ fade: gradient })} />
  ```

- **Name variables after what they hold**, kebab-case, without `--`
  (`'focal-point'`, `'overlay-color'`).
- **Transforms that JS takes over: use `[transform:…]`, not `translate-*` or
  `scale-*`.** Tailwind v4's transform utilities set the separate `translate`
  and `scale` properties, which stack with the `transform` that GSAP or a frame
  loop writes. A `[transform:var(--x)]` class gets replaced by the inline
  `transform` instead. (GSAP folds `translate`/`scale` into its own transform
  in px, so a GSAP tween that sets `y: 0` first can start from
  `translate-y-full`.)
- **Exceptions:** imperative per-frame writes (`el.style.transform` in GSAP or
  a frame loop) follow the performance rules instead, `global-error.tsx`
  keeps inline styles because it renders when the app's CSS may have failed,
  and the root layout's `<html style={{ viewTransitionName: 'root' }}>` stays
  inline because React only keeps the root in a view transition that way.

## Review checklist

Run on every change that adds or edits class names or styles. Each command
should print nothing, except for bracket values that genuinely have no bare
form (see the list above).

```sh
# Brackets around a value the utility accepts bare (aspect, z, opacity, grid, timing, transforms…)
rg -n --pcre2 '(?<![\w-])-?(aspect|z|opacity|order|columns|line-clamp|grid-cols|grid-rows|col-span|row-span|col-start|col-end|row-start|row-end|duration|delay|scale(-[xyz])?|rotate|skew-[xy]|brightness|contrast|saturate|hue-rotate|border(-[xytrbl])?|ring|outline|underline-offset|stroke)-\[[-\d./%a-z]*\]' src

# Bracketed px/rem on spacing & sizing utilities: use the bare class (n = px ÷ 4)
rg -n --pcre2 '(?<![\w-])-?(p[xytrblse]?|m[xytrblse]?|gap(-[xy])?|space-[xy]|inset(-[xy])?|top|right|bottom|left|start|end|w|h|size|min-w|min-h|max-w|max-h|basis|translate-[xy]|leading|indent)-\[-?[\d.]+(rem|px)\]' src

# Raw font sizes: use (or add) a text-* token
rg -n --pcre2 '(?<![\w-])text-\[[\d.]+(rem|px|em)\]' src

# var() inside brackets: use the (--var) shorthand
rg -n '\-\[var\(--' src

# Raw inline CSS: use classes, and toCSSVars for runtime values
rg -n 'style=\{\{' src -g '!global-error.tsx'
rg -n --pcre2 'style=\{(?!toCSSVars\(|\w+\}|\w+ && toCSSVars\()' src -g '!global-error.tsx'

# Off-grid spacing numbers (odd ≥ 5, decimals other than 0.25/0.5)
rg -n --pcre2 '(?<![\w-])-?(p[xytrblse]?|m[xytrblse]?|gap(-[xy])?|space-[xy]|inset(-[xy])?|top|right|bottom|left|start|end|w|h|size|min-w|min-h|max-w|max-h|basis|translate-[xy]|leading|indent)-(?!(1|3|0\.25|0\.5)(?![\w./]))(\d*[13579]|\d+\.\d+)(?![\w./])' src -g '*.tsx' -g '*.ts'

# px anywhere else (brackets, CSS, inline styles): convert to rem on the grid
rg -n --pcre2 '\[[^\]\s]*\d+px[^\]\s]*\]' src -g '!*.css'
rg -n '\b\d+(\.\d+)?px\b' src -g '*.css'

# rem in CSS without a trailing px comment: add /* Npx */
rg -n --pcre2 '\d(\.\d+)?rem\b(?!.*/\*.*px.*\*/)' src -g '*.css' | rg -v '^\S+:\d+:\s*(/\*|\*)'

# rem inside calc()/flex/grid brackets: check each value is on the grid
rg -n --pcre2 -o '[\w:-]*\[[^\]\s]*\d+(\.\d+)?rem[^\]\s]*\]' src -g '*.ts' -g '*.tsx'
```
