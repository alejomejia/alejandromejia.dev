/** A rectangle in viewport pixels (the overlay is `fixed`, so no scroll offset). */
export type InspectBox = { x: number; y: number; w: number; h: number }

/** A redline: starts at (`x`, `y`) and runs `length` px along `axis`. */
export type InspectDistance = { axis: 'x' | 'y'; x: number; y: number; length: number }

/** An element as the overlay draws it: its box, its padding areas and its size label. */
export type InspectMeasure = { box: InspectBox; padding: InspectBox[]; size: string }

/** One row of the selection panel. */
export type InspectDetail = { label: 'size' | 'padding' | 'gap' | 'radius' | 'type'; value: string }

/** Everything the overlay draws in one frame. */
export type InspectSnapshot = {
  column: InspectBox | null
  hovered: InspectMeasure | null
  selected: InspectMeasure | null
  /** Tag and a few words of the selected element, e.g. `h1 "Alejandro Mejía"`. */
  selectedName: string | null
  details: InspectDetail[]
  distances: InspectDistance[]
}
