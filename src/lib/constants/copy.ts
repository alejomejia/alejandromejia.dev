import { SITE } from '@/lib/seo/seo.const'

/**
 * The site's own UI copy (labels, buttons, messages), not CMS content. Kept in
 * one place so every string is easy to find and edit. `{name}` placeholders
 * are filled by `formatMessage()` from `@/lib/utils`.
 */
export const COPY = {
  site: {
    // `SITE` also feeds the manifest and llms.txt.
    description: SITE.description as string,
  },
  breadcrumb: { label: 'Breadcrumb', home: 'Home' },
  home: {
    work: 'Selected work',
    allWork: 'All work',
    recommendations: 'Recommendations',
    writing: 'Writing',
    allWriting: 'All writing',
    craft: 'Craft',
    allCraft: 'All craft',
    draft: 'Draft',
    formats: { article: 'Article', note: 'Note', snippet: 'Snippet' },
  },
  work: {
    title: 'Work',
    description: 'Case studies from 13 years on the web: design systems, product interfaces and the tools around them.',
    selected: 'Selected',
    more: 'More work',
    closing: 'Earlier roles and private work are in the',
    cv: 'CV',
    back: 'All work',
    role: 'Role',
    client: 'Client',
    timeline: 'Timeline',
    stack: 'Stack',
    team: 'Team',
    live: 'Live',
    present: 'Present',
    confidential: 'Private project, shown with permission.',
    inProgress: 'The full write-up is on its way.',
    retrospective: 'What I’d do differently',
    recommendation: 'From the team',
    next: 'Next case study',
    overview: 'Overview',
    chapters: 'Chapters',
    nextChapter: 'Next chapter',
  },
  recommendations: {
    note: 'Copied word for word from LinkedIn.',
    link: 'See them all on my profile',
  },
  story: {
    before: 'Before',
    after: 'After',
    compare: 'Drag to compare before and after',
    private: 'Private project, shown as a recording',
    callout: { note: 'Note', lesson: 'Lesson', tradeoff: 'Trade-off' },
    anchor: 'Link to the section “{section}”',
  },
  header: {
    nav: 'Main',
    home: 'Home',
    cv: 'CV',
    available: 'Open to work',
    localTime: 'Local time in {place}',
  },
  footer: {
    nav: 'Footer',
    more: 'More',
    email: 'Email',
    rss: 'RSS',
    source: 'Source',
  },
  theme: {
    toggle: 'Switch theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  inspect: {
    title: 'Inspect mode',
    exit: 'Exit',
    hint: 'Click an element to select it, then hover another to measure the space between them.',
    keys: 'I toggles · Esc clears, then exits',
    size: 'Size',
    padding: 'Padding',
    gap: 'Gap',
    radius: 'Radius',
    type: 'Type',
  },
  shareCard: {
    // The section line on generated share images (`/og/...`).
    work: 'Work',
    caseStudy: 'Case study',
    writing: 'Writing',
    craft: 'Craft',
    experiment: 'Experiment',
  },
  commandMenu: {
    label: 'Menu',
    open: 'Open menu',
    menu: 'Menu',
    search: 'Search pages, work, writing and actions',
    placeholder: 'Type to search…',
    empty: 'No results.',
    pages: 'Pages',
    work: 'Work',
    writing: 'Writing',
    actions: 'Actions',
    links: 'Links',
    copyEmail: 'Copy email address',
    copyLink: 'Copy link to this page',
    copied: 'Copied',
    theme: 'Theme: {theme}',
    current: 'Current',
    hintMove: 'to move',
    hintSelect: 'to open',
    hintClose: 'to close',
  },
  writing: {
    title: 'Writing',
    pageTitle: 'Writing · Page {page}',
    empty: 'Nothing published yet.',
    updated: 'Updated',
  },
  pagination: {
    label: 'Pagination',
    previous: 'Previous',
    next: 'Next',
    status: 'Page {page} of {total}',
  },
  notFound: {
    title: 'Page not found',
    text: "The page you are looking for doesn't exist or may have been moved.",
    back: 'Back to home',
  },
  error: {
    label: 'Error',
    title: 'Something went wrong',
    text: 'An unexpected error occurred while loading this page. Try again, or head back home.',
    retry: 'Try again',
    back: 'Back to home',
  },
}

/** The shape of the UI copy, for props that receive one of its sections. */
export type Copy = typeof COPY
