import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { seedDrafts } from './seed/drafts'
import { seedGlobals } from './seed/globals'
import { seedProfile } from './seed/profile'

/**
 * Development seed: an admin user (from `SEED_ADMIN_EMAIL` and
 * `SEED_ADMIN_PASSWORD`, only into an empty database), the topics, the
 * Profile global (the CV),
 * the Site settings/Header/Footer globals, drafts of the planned case studies,
 * articles and Craft experiments. Safe to re-run: globals with content are kept. Pass `--overwrite` to reset the globals and the Profile.
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
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (existingUsers.totalDocs === 0 && email && password) {
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Admin', roles: ['admin'] },
    })
    payload.logger.info(`Created admin user ${email}`)
  } else if (existingUsers.totalDocs === 0) {
    // No shared default password: the admin's own first-user form takes over
    // (it skips access control, so it can pick the Admin role).
    payload.logger.info('No users and no SEED_ADMIN_*: create the first user at /admin, as Admin')
  }

  const overwrite = process.argv.includes('--overwrite')
  await seedProfile(payload, { overwrite })
  await seedGlobals(payload, { overwrite })
  await seedDrafts(payload)

  payload.logger.info('Seed complete: profile, topics, work, writing and craft drafts')
  process.exit(0)
}

await seed()
