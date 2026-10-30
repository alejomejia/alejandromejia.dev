/** One role or side project on the CV, resolved to plain values. */
export type CvEntry = {
  id: string
  /** The role, or the project's name. */
  title: string
  /** Where the title links: a project's site. */
  titleHref?: string
  /** A role's company, linked when it has a site: where it is based, and the agency it hired through. */
  organization?: { name: string; href?: string; location?: string; via?: string }
  /** "Apr 2024 – Sep 2025" and how long that was ("1 yr 6 mos"). */
  period?: { label: string; duration: string }
  /** Where Alejandro worked from, or a project's short note. */
  note?: string
  remote?: boolean
  /** A fixed-term contract, not an employee role. */
  contract?: boolean
  summary?: string
  highlights: string[]
  stack: string[]
  /** The case study's path, when there is one. */
  caseStudy?: string
}

export type CvSkillGroup = { label: string; skills: string[] }

/** The Profile global's CV tab, resolved for the page. */
export type CvData = {
  /** The summary's paragraphs. */
  summary: string[]
  experience: CvEntry[]
  projects: CvEntry[]
  skills: CvSkillGroup[]
  education: Array<{ id: string; school: string; degree?: string; years?: string }>
  courses: Array<{ id: string; name: string; issuer?: string }>
  languages: Array<{ id: string; language: string; level?: string }>
  /** Time in remote roles and how many countries their companies were in; `null` without any. */
  remote: { duration: string; countries: number } | null
  /** The uploaded PDF, which the download button links to. */
  pdfUrl?: string
}
