type UnknownObject = Record<string, unknown>

/** True for plain objects (not arrays, not null). */
function isPlainObject(value: unknown): value is UnknownObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Recursively merges `source` into `target`, returning a new object. Nested
 * plain objects are merged; arrays and primitives from `source` overwrite.
 * Used to apply `overrides` onto generated Payload field configs.
 */
export function deepMerge<T extends UnknownObject, S extends UnknownObject>(target: T, source: S): T & S {
  const output: UnknownObject = { ...target }

  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key of Object.keys(source)) {
      const sourceValue = source[key]
      const targetValue = output[key]

      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        output[key] = deepMerge(targetValue, sourceValue)
      } else {
        output[key] = sourceValue
      }
    }
  }

  return output as T & S
}

/**
 * Returns a deep copy of `value` with every string passed through `map`,
 * along with the key it sits under (`undefined` for array items and the
 * root). Plain objects and arrays are walked; anything else is kept as is.
 */
export function mapStrings<T>(value: T, map: (text: string, key: string | undefined) => string, key?: string): T {
  if (typeof value === 'string') return map(value, key) as T
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, map)) as T
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entry]) => [entryKey, mapStrings(entry, map, entryKey)]),
    ) as T
  }
  return value
}

/**
 * Groups items by a key, keeping the order in which each key and item first
 * appears (so a list sorted by date stays sorted inside and across groups).
 * @example groupBy(posts, (post) => post.year) // [['2026', [...]], ['2025', [...]]]
 */
export function groupBy<T>(items: T[], key: (item: T) => string): Array<[string, T[]]> {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const group = key(item)
    groups.set(group, [...(groups.get(group) ?? []), item])
  }
  return [...groups]
}
