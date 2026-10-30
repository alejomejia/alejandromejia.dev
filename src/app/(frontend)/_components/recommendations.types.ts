/**
 * A LinkedIn recommendation as the site shows it. Mirrors the
 * `recommendations` collection (`quote`, `name`, `role`, `company`,
 * `relationship`, `date`, `featured`), plus `excerpt`, which the collection
 * doesn't have yet.
 */
export type Recommendation = {
  /** Stable key; case studies point to it (the collection's `relatedWork`, the other way round). */
  id: string
  name: string
  /** Their title when we worked together, not their current one. */
  role: string
  /** The company where we worked together, not their current one; absent for freelancers. */
  company?: string
  /** How we worked together, when `company` doesn't say it, e.g. "Freelance website". */
  relationship?: string
  /** ISO date LinkedIn gave the recommendation. */
  date: string
  /** Word for word, paragraphs separated by a blank line. */
  quote: string
  /** One or two sentences lifted word for word ("…" marks a cut), for compact places such as the home page. */
  excerpt?: string
  /** Shown on the home page. */
  featured?: boolean
}
