/** Each section's anchor, so `/cv#experience` can be shared. */
export const CV_SECTION_IDS = {
  experience: 'experience',
  projects: 'side-projects',
  skills: 'skills',
  education: 'education',
  recommendations: 'recommendations',
} as const

/**
 * TEMPORARY: in development, the download button shows before a PDF is
 * uploaded (linking nowhere), so its look can be reviewed. Remove once the
 * public PDF is uploaded in Profile > CV.
 */
export const CV_PDF_PREVIEW_HREF = process.env.NODE_ENV === 'development' ? '#' : undefined
