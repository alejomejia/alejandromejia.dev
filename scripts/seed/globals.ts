import type { Payload } from 'payload'

/**
 * Fills the Header and Footer globals. Unless `overwrite` is set, a global
 * that already has content is left alone, so it is safe on real content.
 * Site settings' social links come from `seedProfile()`; the contact email
 * is left for you to set in the admin.
 */
export async function seedGlobals(payload: Payload, { overwrite = false } = {}) {
  const context = { disableRevalidate: true }

  const header = await payload.findGlobal({ slug: 'header', depth: 0 })
  if (overwrite || !header.navItems?.length) {
    await payload.updateGlobal({
      slug: 'header',
      context,
      data: {
        navItems: [
          { link: { type: 'custom', url: '/work', label: 'Work' } },
          { link: { type: 'custom', url: '/writing', label: 'Writing' } },
          { link: { type: 'custom', url: '/craft', label: 'Craft' } },
        ],
      },
    })
  }

  const footer = await payload.findGlobal({ slug: 'footer', depth: 0 })
  if (overwrite || !footer.copyright) {
    await payload.updateGlobal({ slug: 'footer', context, data: { copyright: 'Alejandro Mejía' } })
  }

  payload.logger.info('Seed: globals ready')
}
