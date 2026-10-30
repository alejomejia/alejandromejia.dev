import type { CollectionConfig } from 'payload'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { admins, adminsFieldAccess, adminsOrSelf, authenticated } from '@/payload/access'

/**
 * Auth-enabled Users collection; backs the admin panel login and RBAC.
 *
 * Two roles: `admin` (full access) and `editor` (create + edit content, but no
 * deletes and no user management). Editors may update their own account, yet
 * only admins can change the `roles` field (guards against self-promotion).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    // Any logged-in staff member may reach the admin panel.
    admin: authenticated,
    // User management (create/delete) is admin-only.
    create: admins,
    delete: admins,
    // Read stays open to staff so author/relationship pickers can list users.
    read: authenticated,
    // Admins edit anyone; editors edit only their own account.
    update: adminsOrSelf,
  },
  admin: {
    group: ADMIN_GROUPS.admin,
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      // Stored in the JWT so access checks skip a database lookup.
      saveToJWT: true,
      admin: { position: 'sidebar' },
      // Only admins may assign or change roles.
      access: {
        create: adminsFieldAccess,
        update: adminsFieldAccess,
      },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
  timestamps: true,
}
