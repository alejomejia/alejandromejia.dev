/**
 * Cache tag on every CMS read the public site renders from. The content hooks
 * revalidate it on any public change, so each cached page re-renders on its
 * next visit. One tag for everything on purpose: a page also shows media,
 * topics, recommendations and redirects, and tracking those per page isn't worth it
 * at this site's size.
 */
export const CMS_CACHE_TAG = 'cms'
