import { COPY } from '@/lib/constants/copy'
import { workPath } from '@/lib/seo/seo.utils'
import { formatMessage, formatMonth, monthSpan } from '@/lib/utils'
import type { Profile, Work } from '@/payload-types'

import type { CvData, CvEntry } from './cv.types'

/**
 * How long a role lasted, in CV shorthand.
 * @example cvDuration(18) // '1 yr 6 mos'
 */
export function cvDuration(months: number): string {
  const { year, years, month, months: monthsLabel } = COPY.cv.duration
  const wholeYears = Math.floor(months / 12)
  const rest = months % 12
  return [
    wholeYears > 0 && formatMessage(wholeYears === 1 ? year : years, { count: wholeYears }),
    rest > 0 && formatMessage(rest === 1 ? month : monthsLabel, { count: rest }),
  ]
    .filter(Boolean)
    .join(' ')
}

/** A role's months, "Apr 2024 – Sep 2025", or "Mar 2026 – Present" while it runs. */
function cvPeriod(start: string, end?: string | null): NonNullable<CvEntry['period']> {
  return {
    label: `${formatMonth(start)} – ${end ? formatMonth(end) : COPY.cv.present}`,
    duration: cvDuration(monthSpan(start, end)),
  }
}

/** The key a skill is matched by across the page, so "next.js" and "Next.js" trace together. */
export function skillKey(skill: string): string {
  return skill.trim().toLowerCase()
}

/** A textarea's lines, one highlight each. */
function lines(text?: string | null): string[] {
  return (text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

/** A populated case study's path; an unpopulated (id-only) or missing one gives nothing. */
function caseStudyPath(work?: number | Work | null): string | undefined {
  return typeof work === 'object' && work?.slug ? workPath(work.slug) : undefined
}

/**
 * The remote roles added up: their months, and the countries their
 * companies were in (the last part of "Barcelona, Spain").
 */
function remoteSummary(roles: NonNullable<Profile['experience']>): CvData['remote'] {
  const remote = roles.filter((role) => role.remote)
  if (remote.length === 0) return null
  const months = remote.reduce((total, role) => total + monthSpan(role.startDate, role.endDate), 0)
  const countries = new Set(remote.flatMap((role) => role.companyLocation?.split(',').at(-1)?.trim() || []))
  return { duration: cvDuration(months), countries: countries.size }
}

/** The Profile global (read at depth 1) as the CV page's plain data. Empty fields drop out. */
export function toCvData(profile: Profile): CvData {
  return {
    summary: profile.summary
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    experience: (profile.experience ?? []).map((role, index) => ({
      id: role.id ?? String(index),
      title: role.role,
      organization: {
        name: role.company,
        href: role.companyUrl || undefined,
        location: role.companyLocation || undefined,
        via: role.via || undefined,
      },
      period: cvPeriod(role.startDate, role.endDate),
      note: role.location || undefined,
      remote: Boolean(role.remote),
      contract: role.employment === 'contract',
      summary: role.summary || undefined,
      highlights: lines(role.highlights),
      stack: role.stack ?? [],
      caseStudy: caseStudyPath(role.work),
    })),
    projects: (profile.projects ?? []).map((project, index) => ({
      id: project.id ?? String(index),
      title: project.name,
      titleHref: project.url || undefined,
      note: project.note || undefined,
      summary: project.summary || undefined,
      highlights: lines(project.highlights),
      stack: project.stack ?? [],
      caseStudy: caseStudyPath(project.work),
    })),
    skills: (profile.skills ?? []).map(({ label, skills }) => ({ label, skills })),
    education: (profile.education ?? []).map((school, index) => ({
      id: school.id ?? String(index),
      school: school.school,
      degree: school.degree || undefined,
      years: [school.startYear, school.endYear].filter(Boolean).join('–') || undefined,
    })),
    courses: (profile.certifications ?? []).map((course, index) => ({
      id: course.id ?? String(index),
      name: course.name,
      issuer: course.issuer || undefined,
    })),
    languages: (profile.languages ?? []).map((language, index) => ({
      id: language.id ?? String(index),
      language: language.language,
      level: language.level || undefined,
    })),
    remote: remoteSummary(profile.experience ?? []),
    pdfUrl: (typeof profile.cvFile === 'object' && profile.cvFile?.url) || undefined,
  }
}
