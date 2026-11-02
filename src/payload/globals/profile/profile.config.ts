import type { GlobalConfig } from 'payload'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { textRowLabel } from '@/payload/fields/row-labels'
import { buildGlobalRevalidateHook } from '@/payload/hooks/revalidate-global'

const MONTH_PICKER = { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } as const

/**
 * Who Alejandro is, in one place: the intro and availability the home page,
 * header and footer show, and the whole CV, which the /cv page renders. The
 * downloadable PDF is uploaded here too, so the page and the file stay side
 * by side. Contact email and social profiles stay in Site settings.
 */
export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Profile and CV',
  access: {
    read: () => true,
  },
  admin: {
    group: ADMIN_GROUPS.content,
    description: 'You and your CV. The /cv page is built from the CV tab.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Intro',
          description: 'Shown on the home page, in the header and in the footer.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                {
                  name: 'headline',
                  type: 'text',
                  required: true,
                  admin: { width: '50%', description: 'E.g. "Senior Design Engineer".' },
                },
              ],
            },
            {
              name: 'intro',
              type: 'textarea',
              required: true,
              admin: { rows: 3, description: 'One or two sentences at the top of the home page.' },
            },
            {
              name: 'availability',
              type: 'textarea',
              admin: {
                rows: 4,
                description:
                  'Under "Open to work" in the sidebar: one role per row, written in full ("Design Engineer", not "Design"), then where on the last row, e.g. "Remote in the EU, UK or US". Shown while "Open to work" is on.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'location',
                  type: 'text',
                  admin: { width: '50%', description: 'E.g. "Navarra, Spain".' },
                },
                {
                  name: 'timezone',
                  type: 'text',
                  defaultValue: 'Europe/Madrid',
                  admin: {
                    width: '50%',
                    description: 'For the footer’s local time. An IANA name, e.g. "Europe/Madrid".',
                  },
                  validate: (value: string | null | undefined) => {
                    if (!value) return true
                    try {
                      new Intl.DateTimeFormat('en', { timeZone: value })
                      return true
                    } catch {
                      return 'Use an IANA time zone name, e.g. "Europe/Madrid".'
                    }
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'CV',
          description: 'Rendered as the /cv page, section by section.',
          fields: [
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              admin: { rows: 4, description: 'The short paragraph at the top of the CV.' },
            },
            {
              name: 'cvFile',
              type: 'upload',
              relationTo: 'documents',
              label: 'CV (PDF)',
              admin: { description: 'The "Download PDF" button. Leave your phone number out of the public file.' },
            },
            {
              name: 'experience',
              type: 'array',
              labels: { singular: 'Role', plural: 'Experience' },
              admin: {
                initCollapsed: true,
                description: 'Most recent first.',
                components: { RowLabel: textRowLabel('company', 'Role') },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'company', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'companyUrl',
                      type: 'text',
                      label: 'Company link',
                      admin: { width: '50%', description: 'Optional.' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'companyLocation',
                      type: 'text',
                      label: 'Company based in',
                      admin: {
                        width: '50%',
                        description: 'Optional. City and country, or just the country, e.g. "Sweden".',
                      },
                    },
                    {
                      name: 'via',
                      type: 'text',
                      label: 'Hired through',
                      admin: { width: '50%', description: 'Optional. The agency or contractor, e.g. "Kodly".' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'role', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'location',
                      type: 'text',
                      label: 'Worked from',
                      admin: { width: '50%', description: 'Where you were, e.g. "Medellín, Colombia".' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'employment',
                      type: 'select',
                      defaultValue: 'full-time',
                      options: [
                        { label: 'Full-time', value: 'full-time' },
                        { label: 'Contract', value: 'contract' },
                      ],
                      admin: {
                        width: '50%',
                        description: 'Contract shows a "Contract" tag: it explains a short, project-based stay.',
                      },
                    },
                    {
                      name: 'remote',
                      type: 'checkbox',
                      defaultValue: false,
                      label: 'Remote',
                      admin: {
                        width: '50%',
                        description: 'Shows a "Remote" tag and counts toward the remote total at the top of the CV.',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'startDate',
                      type: 'date',
                      label: 'Started',
                      required: true,
                      admin: { width: '50%', date: MONTH_PICKER },
                    },
                    {
                      name: 'endDate',
                      type: 'date',
                      label: 'Ended',
                      admin: { width: '50%', date: MONTH_PICKER, description: 'Empty reads as "Present".' },
                    },
                  ],
                },
                {
                  name: 'summary',
                  type: 'textarea',
                  admin: { rows: 2, description: 'Optional. One sentence on the company or the team.' },
                },
                {
                  name: 'highlights',
                  type: 'textarea',
                  admin: { rows: 4, description: 'What you achieved, one per line. Two to four is plenty.' },
                },
                {
                  name: 'stack',
                  type: 'text',
                  hasMany: true,
                  admin: { description: 'Optional. Press Enter after each.' },
                },
                {
                  name: 'work',
                  type: 'relationship',
                  relationTo: 'work',
                  label: 'Case study',
                  admin: { description: 'Optional. Linked from this role.' },
                },
              ],
            },
            {
              name: 'projects',
              type: 'array',
              labels: { singular: 'Project', plural: 'Side projects' },
              admin: {
                initCollapsed: true,
                description: 'Your own projects, after the roles.',
                components: { RowLabel: textRowLabel('name', 'Project') },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'url', type: 'text', label: 'Link', admin: { width: '50%', description: 'Optional.' } },
                  ],
                },
                {
                  name: 'note',
                  type: 'text',
                  admin: { description: 'Optional. A short line beside the name, e.g. "Independent · private code".' },
                },
                {
                  name: 'summary',
                  type: 'textarea',
                  admin: { rows: 2, description: 'Optional. One sentence on what it is.' },
                },
                {
                  name: 'highlights',
                  type: 'textarea',
                  admin: { rows: 4, description: 'What it does or proves, one per line.' },
                },
                {
                  name: 'stack',
                  type: 'text',
                  hasMany: true,
                  admin: { description: 'Optional. Press Enter after each.' },
                },
                {
                  name: 'work',
                  type: 'relationship',
                  relationTo: 'work',
                  label: 'Case study',
                  admin: { description: 'Optional. Linked from this project.' },
                },
              ],
            },
            {
              name: 'skills',
              type: 'array',
              labels: { singular: 'Skill group', plural: 'Skills' },
              admin: {
                initCollapsed: true,
                components: { RowLabel: textRowLabel('label', 'Skill group') },
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { description: 'E.g. "Design systems".' },
                },
                {
                  name: 'skills',
                  type: 'text',
                  hasMany: true,
                  required: true,
                  admin: { description: 'Press Enter after each.' },
                },
              ],
            },
            {
              name: 'education',
              type: 'array',
              labels: { singular: 'School', plural: 'Education' },
              admin: { initCollapsed: true, components: { RowLabel: textRowLabel('school', 'School') } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'school', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'degree', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'startYear', type: 'number', label: 'From', admin: { width: '50%', step: 1 } },
                    { name: 'endYear', type: 'number', label: 'To', admin: { width: '50%', step: 1 } },
                  ],
                },
              ],
            },
            {
              name: 'certifications',
              type: 'array',
              // Shown as "Courses" (the CV's wording); the field name stays stable.
              labels: { singular: 'Course', plural: 'Courses' },
              admin: { initCollapsed: true, components: { RowLabel: textRowLabel('name', 'Course') } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'issuer',
                      type: 'text',
                      admin: { width: '50%', description: 'Optional. E.g. "Anthropic".' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'languages',
              type: 'array',
              labels: { singular: 'Language', plural: 'Languages' },
              admin: { initCollapsed: true, components: { RowLabel: textRowLabel('language', 'Language') } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'language', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'level',
                      type: 'text',
                      admin: { width: '50%', description: 'E.g. "Native" or "Full professional".' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      // In the sidebar, so the switch is one click away from any tab.
      name: 'available',
      type: 'checkbox',
      defaultValue: false,
      label: 'Open to work',
      admin: {
        position: 'sidebar',
        description: 'Shows the pulsing green dot and the status line in the header.',
      },
    },
  ],
  hooks: {
    afterChange: [buildGlobalRevalidateHook('profile')],
  },
}
