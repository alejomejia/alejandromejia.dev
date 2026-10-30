import configPromise from '@payload-config'
import { readFile } from 'fs/promises'
import { getPayload } from 'payload'

/**
 * Imports the recommendations you've received on LinkedIn into the
 * Recommendations collection, word for word.
 *
 * 1. LinkedIn → Settings → Data privacy → Get a copy of your data → pick
 *    "Recommendations" → download the archive when LinkedIn emails it.
 * 2. pnpm import:recommendations path/to/Recommendations_Received.csv
 *
 * Only visible recommendations are imported. One already imported (same name
 * and date) is skipped, so it is safe to re-run with a newer export. Role and
 * company are their job title and company at export time: correct them in the
 * admin to what they were when you worked together, and fill in the
 * relationship and LinkedIn link.
 */

/** Columns this script reads from LinkedIn's export. */
const COLUMNS = {
  firstName: 'First Name',
  lastName: 'Last Name',
  company: 'Company',
  jobTitle: 'Job Title',
  text: 'Text',
  date: 'Creation Date',
  status: 'Status',
} as const

/** Parses CSV with quoted fields (commas, quotes and line breaks inside quotes). */
function parseCsv(input: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let index = 0; index < input.length; index++) {
    const char = input[index]
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        field += '"'
        index++
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
    } else if (char === '"') {
      quoted = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[index + 1] === '\n') index++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }
  if (field || row.length > 0) rows.push([...row, field])
  return rows.filter((cells) => cells.some((cell) => cell.trim()))
}

async function importRecommendations() {
  const file = process.argv.slice(2).find((arg) => arg.endsWith('.csv'))
  if (!file) throw new Error('Pass the path to Recommendations_Received.csv')

  // LinkedIn's CSVs may start with a byte order mark.
  const [header, ...rows] = parseCsv((await readFile(file, 'utf8')).replace(/^﻿/, ''))
  const column = Object.fromEntries(
    Object.entries(COLUMNS).map(([key, name]) => [key, header.findIndex((cell) => cell.trim() === name)]),
  ) as Record<keyof typeof COLUMNS, number>
  const missing = Object.entries(column).filter(([key, index]) => index === -1 && key !== 'status')
  if (missing.length > 0) {
    throw new Error(
      `Missing columns: ${missing.map(([key]) => COLUMNS[key as keyof typeof COLUMNS]).join(', ')}. Found: ${header.join(', ')}`,
    )
  }

  const payload = await getPayload({ config: configPromise })
  let created = 0

  for (const cells of rows) {
    const status = column.status === -1 ? 'VISIBLE' : cells[column.status]?.trim().toUpperCase()
    const quote = cells[column.text]?.trim()
    if (status !== 'VISIBLE' || !quote) continue

    const name = `${cells[column.firstName] ?? ''} ${cells[column.lastName] ?? ''}`.trim()
    const parsed = new Date(cells[column.date] ?? '')
    const date = Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString()

    const { totalDocs } = await payload.count({
      collection: 'recommendations',
      where: { and: [{ name: { equals: name } }, ...(date ? [{ date: { equals: date } }] : [])] },
    })
    if (totalDocs > 0) continue

    await payload.create({
      collection: 'recommendations',
      context: { disableRevalidate: true },
      data: {
        quote,
        name,
        role: cells[column.jobTitle]?.trim() || undefined,
        company: cells[column.company]?.trim() || undefined,
        date,
      },
    })
    created++
  }

  payload.logger.info(`Imported ${created} recommendations (${rows.length} rows in the file)`)
  process.exit(0)
}

await importRecommendations()
