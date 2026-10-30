import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { seedDrafts } from './seed/drafts'
import { seedGlobals } from './seed/globals'
import { seedProfile } from './seed/profile'

/**
 * Development seed: an admin user, the topics, the Profile global (the CV),
 * the Site settings/Header/Footer globals, drafts of the planned case studies
 * and articles. Safe to re-run: globals with content are kept. Pass `--overwrite` to reset the globals and the Profile.
 *
 * The seed runs outside Next, so a
 * deployed site keeps its cached pages: save any document in that
 * environment's admin (or redeploy) afterwards.
 *
 * Run with: pnpm seed
 */
async function seed() {
  const payload = await getPayload({ config: configPromise })

  const existingUsers = await payload.count({ collection: 'users' })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: 'admin@example.com', password: 'test1234', name: 'Admin', roles: ['admin'] },
    })
    payload.logger.info('Created admin user admin@example.com / test1234')
  }

  const overwrite = process.argv.includes('--overwrite')
  await seedProfile(payload, { overwrite })
  await seedGlobals(payload, { overwrite })
  await seedDrafts(payload)

  payload.logger.info('Seed complete: profile, topics, work and writing drafts')
  process.exit(0)
}

await seed()
