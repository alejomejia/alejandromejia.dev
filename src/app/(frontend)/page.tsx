import type { Metadata } from 'next'

import { HalftoneShape } from '@/components/effects/halftone-shape'
import { JsonLd } from '@/components/seo/json-ld'
import { queryHomeContent } from '@/lib/cms/home.server'
import { queryProfileIntro } from '@/lib/cms/profile.server'
import { COPY } from '@/lib/constants/copy'
import { homePageJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata } from '@/lib/seo/metadata'
import { enter } from '@/lib/utils'

import { HomeCraft } from './_components/home-craft'
import { HomeRecommendations } from './_components/home-recommendations'
import { HomeWork } from './_components/home-work'
import { HomeWriting } from './_components/home-writing'
import { RECOMMENDATIONS } from './_components/recommendations.mock'

/** Entrance steps a list section takes: its label, then one per item (none when it's left out). */
function enterSteps(entries: unknown[]): number {
  return entries.length > 0 ? entries.length + 1 : 0
}

/** "Alejandro Mejía · Senior Design Engineer": the name and role lead the home title. */
function homeTitle({ name, headline }: { name: string; headline: string }): string {
  return headline ? `${name} · ${headline}` : name
}

// Rendered per request: a build-time copy would need the database during the
// Docker build. Cheap: the data comes from the CMS cache, not a query per hit.
export const dynamic = 'force-dynamic'

/**
 * Home page. The sidebar already says who Alejandro is, so the content column
 * opens with the signature loop as a dot field the width of the column, then
 * featured Work, the latest Writing and Craft, and last a few LinkedIn
 * recommendations (from the mock until they move to the CMS). A list with
 * nothing published is left out.
 */
export default async function HomePage() {
  const [{ work, writing, craft }, profile] = await Promise.all([queryHomeContent(), queryProfileIntro()])
  const copy = COPY.home
  const recommendations = RECOMMENDATIONS.filter((recommendation) => recommendation.featured)
  // Reading order: the loop, then each section's label and rows.
  const workFrom = 1
  const writingFrom = workFrom + enterSteps(work)
  const craftFrom = writingFrom + enterSteps(writing)
  const recommendationsFrom = craftFrom + enterSteps(craft)

  return (
    <div className="flex flex-col gap-pad-2xl">
      <JsonLd data={homePageJsonLd({ name: homeTitle(profile), description: COPY.site.description })} />
      {/* The page's one heading, for screen readers and crawlers: it repeats the
          name and headline the sidebar already shows, so nothing is hidden. */}
      <h1 className="sr-only">
        {profile.name}, {profile.headline}
      </h1>
      {/* `min-h-0`: otherwise Chrome lets the canvas's own size stretch the box. */}
      <div {...enter(0, 'aspect-3/2 min-h-0 w-full sm:aspect-2/1')}>
        <HalftoneShape speed={0.8} />
      </div>
      <HomeWork entries={work} copy={copy} enterFrom={workFrom} />
      <HomeWriting entries={writing} copy={copy} enterFrom={writingFrom} />
      <HomeCraft entries={craft} copy={copy} enterFrom={craftFrom} />
      <HomeRecommendations entries={recommendations} copy={copy} enterFrom={recommendationsFrom} />
    </div>
  )
}

/**
 * The home page is Alejandro's profile: the title is his name and headline,
 * the description the site's one-sentence bio, and `og:type` is `profile`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const profile = await queryProfileIntro()
  const [firstName = profile.name, ...lastNames] = profile.name.split(' ')

  return buildMetadata({
    title: { absolute: homeTitle(profile) },
    path: '/',
    profile: { firstName, lastName: lastNames.join(' ') },
  })
}
