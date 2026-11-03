import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/json-ld'
import { TextLink } from '@/components/ui/text-link'
import { queryProfileCv } from '@/lib/cms/profile.server'
import { querySiteSettings } from '@/lib/cms/site-settings.server'
import { COPY } from '@/lib/constants/copy'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { breadcrumbJsonLd, profilePageJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata } from '@/lib/seo/metadata'

import { LabelRow } from '@/app/(frontend)/_components/label-row'
import { RecommendationsList } from '@/app/(frontend)/_components/recommendations-list'
import { RECOMMENDATIONS } from '@/app/(frontend)/_components/recommendations.mock'
import { CV_PDF_PREVIEW_HREF, CV_SECTION_IDS } from './_components/cv.const'
import { skillKey, toCvData } from './_components/cv.utils'
import { CvEntries } from './_components/cv-entries'
import { CvHeader } from './_components/cv-header'
import { CvIndex } from './_components/cv-index'
import { CvSection } from './_components/cv-section'
import { CvSkill, CvTrace } from './_components/cv-trace'

export const metadata: Metadata = buildMetadata({
  title: COPY.cv.title,
  description: COPY.cv.description,
  path: SITE_ROUTES.cv,
})

// Rendered per request: a build-time copy would need the database during the
// Docker build. Cheap: the Profile comes from the CMS cache. It also keeps
// the current role's length ("8 mos") up to date.
export const dynamic = 'force-dynamic'

/**
 * The CV, from the Profile global: the summary and contact, a sticky index
 * of the sections, then the roles, side projects, skills, education,
 * courses, languages and the featured LinkedIn recommendations (as on the
 * home page, with the link to all of them). Skills trace: hovering one fades
 * the roles that didn't use it. Printing gives a clean CV (no chrome, no
 * recommendations). Ends on Work.
 */
export default async function CvPage() {
  const [profile, settings] = await Promise.all([queryProfileCv(), querySiteSettings()])
  const copy = COPY.cv
  const cv = toCvData(profile)

  // Only skills some role or project lists can be traced; the rest are plain tags.
  const traceable = new Set([...cv.experience, ...cv.projects].flatMap((entry) => entry.stack.map(skillKey)))
  const recommendations = RECOMMENDATIONS.filter((recommendation) => recommendation.featured)
  const hasEducation = cv.education.length + cv.courses.length + cv.languages.length > 0

  const sections = [
    cv.experience.length > 0 && { id: CV_SECTION_IDS.experience, label: copy.experience },
    cv.projects.length > 0 && { id: CV_SECTION_IDS.projects, label: copy.projects },
    cv.skills.length > 0 && { id: CV_SECTION_IDS.skills, label: copy.skills },
    hasEducation && { id: CV_SECTION_IDS.education, label: copy.education },
    recommendations.length > 0 && { id: CV_SECTION_IDS.recommendations, label: copy.recommendations },
  ].filter((section) => section !== false)

  return (
    // No gap on this wrapper: it spans the whole page, so the index stays
    // stuck to the top until the very end.
    <div className="flex flex-col">
      <JsonLd data={breadcrumbJsonLd([{ name: copy.title, path: SITE_ROUTES.cv }])} />
      <JsonLd
        data={profilePageJsonLd({
          path: SITE_ROUTES.cv,
          name: copy.title,
          description: copy.description,
          roles: profile.experience ?? [],
          schools: cv.education.map(({ school }) => school),
          languages: cv.languages.map(({ language }) => language),
        })}
      />

      <CvHeader
        name={profile.name}
        headline={profile.headline}
        available={Boolean(profile.available)}
        availability={profile.availability?.trim() || null}
        location={profile.location?.trim() || null}
        email={settings.contact.email}
        links={settings.socialLinks}
        summary={cv.summary}
        remote={cv.remote}
        className="mb-pad-l"
      />
      <CvIndex sections={sections} pdfUrl={cv.pdfUrl ?? CV_PDF_PREVIEW_HREF} />

      <div className="mt-pad-xl flex flex-col gap-pad-2xl">
        <CvTrace>
          {cv.experience.length > 0 && (
            <CvSection
              id={CV_SECTION_IDS.experience}
              label={copy.experience}
              aside={
                cv.experience.some((role) => role.contract) && <span className="text-right">{copy.contractNote}</span>
              }
            >
              <CvEntries entries={cv.experience} />
            </CvSection>
          )}

          {cv.projects.length > 0 && (
            <CvSection id={CV_SECTION_IDS.projects} label={copy.projects}>
              <CvEntries entries={cv.projects} />
            </CvSection>
          )}

          {cv.skills.length > 0 && (
            <CvSection
              id={CV_SECTION_IDS.skills}
              label={copy.skills}
              aside={<span className="text-right print:hidden">{copy.skillsHint}</span>}
              className="break-inside-avoid"
            >
              <ul className="flex flex-col gap-pad-s">
                {cv.skills.map((group) => (
                  <li key={group.label}>
                    <LabelRow label={group.label}>
                      <ul className="flex flex-wrap gap-1">
                        {group.skills.map((skill) => (
                          <li key={skill}>
                            <CvSkill
                              name={skill}
                              traceKey={traceable.has(skillKey(skill)) ? skillKey(skill) : undefined}
                            />
                          </li>
                        ))}
                      </ul>
                    </LabelRow>
                  </li>
                ))}
              </ul>
            </CvSection>
          )}
        </CvTrace>

        {hasEducation && (
          <CvSection id={CV_SECTION_IDS.education} label={copy.education} className="break-inside-avoid">
            <div className="flex flex-col gap-pad-m">
              {cv.education.length > 0 && (
                <ul className="flex flex-col gap-pad-s">
                  {cv.education.map(({ id, school, degree, years }) => (
                    <li key={id}>
                      <LabelRow label={years}>
                        <p className="font-medium">{school}</p>
                        {degree && <p className="text-caption text-pretty text-muted">{degree}</p>}
                      </LabelRow>
                    </li>
                  ))}
                </ul>
              )}
              {cv.courses.length > 0 && (
                <LabelRow label={copy.courses}>
                  <ul className="flex flex-col gap-1">
                    {cv.courses.map(({ id, name, issuer }) => (
                      <li key={id}>
                        {name}
                        {issuer && <span className="text-subtle"> · {issuer}</span>}
                      </li>
                    ))}
                  </ul>
                </LabelRow>
              )}
              {cv.languages.length > 0 && (
                <LabelRow label={copy.languages}>
                  <ul className="flex flex-col gap-1">
                    {cv.languages.map(({ id, language, level }) => (
                      <li key={id}>
                        {language}
                        {level && <span className="text-subtle"> · {level}</span>}
                      </li>
                    ))}
                  </ul>
                </LabelRow>
              )}
            </div>
          </CvSection>
        )}

        {recommendations.length > 0 && (
          <CvSection id={CV_SECTION_IDS.recommendations} label={copy.recommendations} className="print:hidden">
            <RecommendationsList entries={recommendations} />
          </CvSection>
        )}

        <p className="text-caption text-muted print:hidden">
          {copy.closing}{' '}
          <TextLink href={SITE_ROUTES.work} variant="underline">
            {copy.work}
          </TextLink>
          .
        </p>
      </div>
    </div>
  )
}
