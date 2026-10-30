import type { Access, AccessArgs, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

/** Role literals available on a user. Mirrors the `roles` select in `users.ts`. */
type Role = NonNullable<User['roles']>[number]

/** True when the user is logged in and carries the given role. */
function userHasRole(user: User | null | undefined, role: Role): boolean {
  return Boolean(user?.roles?.includes(role))
}

/** Grants access to everyone, authenticated or not. */
export const anyone: Access = function anyone() {
  return true
}

/** Grants access only to logged-in users (any role). */
export function authenticated({ req: { user } }: AccessArgs<User>): boolean {
  return Boolean(user)
}

/**
 * Collection access restricted to the `admin` role. Use for destructive or
 * privileged operations (delete, user management) that editors must not have.
 */
export const admins: Access = function admins({ req: { user } }) {
  return userHasRole(user, 'admin')
}

/** Field-level counterpart of {@link admins} (e.g. to lock the `roles` field). */
export const adminsFieldAccess: FieldAccess = function adminsFieldAccess({ req: { user } }) {
  return userHasRole(user, 'admin')
}

/**
 * Admins may act on any document; other logged-in users only on their own
 * (returns an `id` query constraint). Used for self-service account updates.
 */
export const adminsOrSelf: Access = function adminsOrSelf({ req: { user } }) {
  if (!user) return false
  if (userHasRole(user, 'admin')) return true

  return {
    id: {
      equals: user.id,
    },
  }
}

/**
 * Logged-in users see everything; the public sees only published documents.
 * Returns a query constraint (`_status = published`) for anonymous requests,
 * so it composes with Payload's row-level filtering.
 */
export const authenticatedOrPublished: Access = function authenticatedOrPublished({
  req: { user },
}) {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
