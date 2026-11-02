#!/usr/bin/env node
// @ts-check

/**
 * Replace a remote database with a copy of the local one. The site has one,
 * production:
 *
 *   pnpm db:push prod     # target = PROD_DATABASE_URL
 *
 * The local DB is built by Payload's dev-mode schema push, so its schema can
 * drift from the migrations (e.g. a renamed block keeps its old sequence and
 * constraint names). Copying it as-is would carry that drift to the target and
 * break later migrations. Instead the script:
 *
 *   1. Builds a staging DB next to the local one: schema from the committed
 *      migrations (`payload migrate`), then the local data on top of it.
 *      This also fails early if the local schema has changes that have no
 *      migration yet.
 *   2. Asks for confirmation (type the target name).
 *   3. Backs up the target to `.db-backups/<target>-<timestamp>.sql`.
 *   4. Copies the media files in R2 to the target's folder (see below).
 *   5. Replaces the target's `public` schema with the staging DB in a single
 *      transaction: if anything fails, the target DB is left untouched.
 *
 * Afterwards the target's `payload_migrations` lists every committed migration,
 * so the next deploy's `payload migrate` has nothing to run.
 *
 * Postgres tools run in Docker (`postgres:16-alpine`, same as the local db; set
 * PG_IMAGE to override), so nothing needs installing on the host. A target on
 * localhost (e.g. an SSH tunnel) is reached via host.docker.internal.
 *
 * Media: the R2 bucket is shared and each environment has its own folder
 * (`R2_MEDIA_PREFIX`). Every object under the local folder is copied server
 * side to the target's folder, the same path with the target as its last
 * segment (website/cms/local → website/cms/prod), and the staging Media rows
 * are repointed there
 * (`prefix` and every stored URL). Existing files in the target folder are
 * overwritten by name, never deleted. Skipped when R2 isn't configured locally.
 */

import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { closeSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'

const PG_IMAGE = process.env.PG_IMAGE || 'postgres:16-alpine'
const BACKUP_DIR = '.db-backups'

const target = process.argv[2]
if (!target || !/^[a-z0-9_-]+$/i.test(target)) {
  fail('Usage: pnpm db:push <target>   (e.g. pnpm db:push prod)')
}

const targetVar = `${target.toUpperCase().replace(/-/g, '_')}_DATABASE_URL`
const localUrl = process.env.DATABASE_URL
const targetUrl = process.env[targetVar]
if (!localUrl) fail('DATABASE_URL is not set (.env).')
if (!targetUrl) fail(`${targetVar} is not set. Add it to .env.`)
if (describe(localUrl) === describe(targetUrl)) fail(`${targetVar} points at the local database.`)

// Same trimming and fallback as src/payload/plugins/storage.ts.
const trimSlashes = (/** @type {string} */ value) => value.replace(/^\/+|\/+$/g, '')
const isR2Configured = Boolean(
  process.env.R2_BUCKET && process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY,
)
const localPrefix = trimSlashes(process.env.R2_MEDIA_PREFIX || 'website/cms/local')
const targetPrefix = localPrefix.replace(/[^/]+$/, target)
const copyMedia = isR2Configured && localPrefix !== targetPrefix

const stagingUrl = withDatabase(localUrl, `${new URL(localUrl).pathname.slice(1)}_push_staging`)
const stagingName = new URL(stagingUrl).pathname.slice(1)

console.log(`\nSource:  ${describe(localUrl)} (local)`)
console.log(`Target:  ${describe(targetUrl)} (${target})`)
console.log(
  copyMedia
    ? `Media:   r2://${process.env.R2_BUCKET}/${localPrefix}/ → ${targetPrefix}/\n`
    : `Media:   not copied (${isR2Configured ? 'same folder' : 'R2 not configured'})\n`,
)

const tmp = path.join(os.tmpdir(), `db-push-${Date.now()}`)
const dataFile = path.join(tmp, 'data.sql')
const stagingFile = path.join(tmp, 'staging.sql')
mkdirSync(tmp, { recursive: true })
let cleanedUp = false
/** Drop the staging DB and temp files; runs on success and on any failure. */
function cleanup() {
  if (cleanedUp) return
  cleanedUp = true
  rmSync(tmp, { recursive: true, force: true })
  dropStaging()
}
process.on('exit', cleanup)

try {
  // 1. Staging: migrations schema + local data.
  step(`Building staging DB "${stagingName}" from the migrations`)
  dropStaging()
  psql(localUrl, `CREATE DATABASE "${stagingName}";`, { transaction: false })
  run('pnpm', ['payload', 'migrate'], { env: { ...process.env, DATABASE_URL: stagingUrl, CI: 'true' } })

  step('Copying local data into staging')
  // --disable-triggers turns FK checks off while loading (data is dumped by
  // table name, not FK order; media and folders even reference themselves).
  pgDump(localUrl, ['--data-only', '--disable-triggers', '--exclude-table-data=payload_migrations'], dataFile)
  // Sequence values are dropped here and reset from the data below, since
  // drifted local sequence names may not exist in the migrated schema.
  const loadScript = [
    `\\i /work/data.sql`,
    resetSequencesSql(),
    ...(copyMedia ? [repointMediaSql(localPrefix, targetPrefix)] : []),
  ].join('\n')
  stripSetvals(dataFile)
  psql(stagingUrl, loadScript, { mount: tmp })

  pgDump(stagingUrl, ['--no-owner', '--no-privileges'], stagingFile)

  // 2. Confirm.
  console.log(`\nThis REPLACES every table in ${describe(targetUrl)} (${target}) with the local data.`)
  if (copyMedia) console.log(`It also copies the local media files into ${targetPrefix}/ in the bucket.`)
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = (await rl.question(`Type "${target}" to continue: `)).trim()
  rl.close()
  if (answer !== target) fail('Aborted. The target was not touched.')

  // 3. Backup.
  step(`Backing up ${target}`)
  mkdirSync(BACKUP_DIR, { recursive: true })
  const backupFile = path.join(BACKUP_DIR, `${target}-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`)
  pgDump(targetUrl, ['--no-owner', '--no-privileges'], backupFile)
  console.log(`  saved ${backupFile}`)

  // 4. Media files, before the DB that points at them.
  if (copyMedia) {
    step(`Copying media files to ${targetPrefix}/`)
    await copyMediaObjects(localPrefix, targetPrefix)
  }

  // 5. Replace, atomically.
  step(`Replacing ${target}`)
  psql(
    targetUrl,
    ['DROP SCHEMA IF EXISTS public CASCADE;', 'CREATE SCHEMA public;', '\\i /work/staging.sql'].join('\n'),
    {
      mount: tmp,
    },
  )
  console.log(`\nDone. ${target} now matches local. Backup: ${backupFile}`)
} finally {
  cleanup()
}

/** Server-side copy of every object under `from/` to `to/` in the bucket. */
async function copyMediaObjects(from, to) {
  // The AWS SDK ships with @payloadcms/storage-s3; borrow it instead of adding a dependency.
  const require = createRequire(createRequire(import.meta.url).resolve('@payloadcms/storage-s3'))
  const { S3Client, ListObjectsV2Command, CopyObjectCommand } = require('@aws-sdk/client-s3')
  const bucket = /** @type {string} */ (process.env.R2_BUCKET)
  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
    forcePathStyle: true,
  })

  /** @type {string[]} */
  const keys = []
  let token
  do {
    const page = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: `${from}/`, ContinuationToken: token }),
    )
    for (const object of page.Contents ?? []) if (object.Key) keys.push(object.Key)
    token = page.NextContinuationToken
  } while (token)

  let done = 0
  const queue = [...keys]
  const worker = async () => {
    for (let key = queue.shift(); key; key = queue.shift()) {
      await client.send(
        new CopyObjectCommand({
          Bucket: bucket,
          Key: `${to}/${key.slice(from.length + 1)}`,
          CopySource: `${bucket}/${key.split('/').map(encodeURIComponent).join('/')}`,
        }),
      )
      done++
      if (done % 50 === 0 || done === keys.length) console.log(`  ${done}/${keys.length}`)
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker))
  if (keys.length === 0) console.log('  no files found')
}

/** Move Media rows to the target folder: `prefix` and every stored URL. */
function repointMediaSql(from, to) {
  const lit = (/** @type {string} */ value) => `'${value.replace(/'/g, "''")}'`
  return `DO $$
DECLARE c text;
BEGIN
  FOR c IN
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'media' AND data_type IN ('character varying', 'text')
  LOOP
    EXECUTE format('UPDATE public.media SET %I = replace(%I, %L, %L)', c, c, ${lit(`/${from}/`)}, ${lit(`/${to}/`)});
  END LOOP;
  UPDATE public.media SET prefix = ${lit(to)} WHERE prefix = ${lit(from)};
END $$;`
}

function dropStaging() {
  psql(localUrl, `DROP DATABASE IF EXISTS "${stagingName}" WITH (FORCE);`, { transaction: false, quiet: true })
}

/** Run SQL via psql (in a single transaction by default), stopping at the first error. */
function psql(url, sql, { mount = '', quiet = false, transaction = true } = {}) {
  const flags = [
    '-X',
    '-q',
    '-o',
    '/dev/null',
    '-v',
    'ON_ERROR_STOP=1',
    ...(transaction ? ['--single-transaction'] : []),
  ]
  docker(['psql', ...flags, '-d', dockerUrl(url)], {
    input: sql,
    mount,
    quiet,
  })
}

/** pg_dump `url` into a local file. */
function pgDump(url, args, file) {
  const fd = openSync(file, 'w')
  try {
    docker(['pg_dump', '-d', dockerUrl(url), ...args], { stdout: fd })
  } finally {
    closeSync(fd)
  }
}

/**
 * Run a Postgres client tool in a throwaway container. Server notices are
 * silenced, and so is pg_dump's circular-FK warning (the data load disables
 * FK checks, so it doesn't apply).
 */
function docker(cmd, { input = undefined, mount = '', stdout = undefined, quiet = false } = {}) {
  const args = [
    'run',
    '--rm',
    '-i',
    '-e',
    'PGOPTIONS=-c client_min_messages=warning',
    ...(mount ? ['-v', `${mount}:/work:ro`] : []),
    PG_IMAGE,
    ...cmd,
  ]
  const res = spawnSync('docker', args, {
    input,
    encoding: 'utf8',
    maxBuffer: 1 << 30,
    stdio: [input === undefined ? 'ignore' : 'pipe', stdout ?? (quiet ? 'ignore' : 'inherit'), 'pipe'],
  })
  let skipping = false
  const stderr = (res.stderr ?? '')
    .split('\n')
    .filter((line) => {
      if (/circular foreign-key constraints/.test(line)) skipping = true
      else if (!/^pg_dump: (detail|hint):/.test(line)) skipping = false
      return line.trim() && !skipping
    })
    .join('\n')
  if (stderr && !quiet) process.stderr.write(`${stderr}\n`)
  if (res.status !== 0 && !quiet) fail(`${cmd[0]} failed (exit ${res.status}).`)
}

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (res.status !== 0) fail(`${cmd} ${args.join(' ')} failed.`)
}

/** Remove `SELECT pg_catalog.setval(...)` lines from a data dump. */
function stripSetvals(file) {
  const kept = readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => !line.startsWith('SELECT pg_catalog.setval'))
  writeFileSync(file, kept.join('\n'))
}

/** Point every serial sequence at max(id) + 1 of the column that owns it. */
function resetSequencesSql() {
  return `DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT s.relname AS seq, t.relname AS tbl, a.attname AS col
    FROM pg_class s
    JOIN pg_depend d ON d.objid = s.oid AND d.deptype = 'a'
    JOIN pg_class t ON t.oid = d.refobjid
    JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = d.refobjsubid
    WHERE s.relkind = 'S' AND s.relnamespace = 'public'::regnamespace
  LOOP
    EXECUTE format('SELECT setval(%L, coalesce((SELECT max(%I) FROM public.%I), 0) + 1, false)',
      'public.' || r.seq, r.col, r.tbl);
  END LOOP;
END $$;`
}

/** Containers can't see the host's localhost; route it through Docker. */
function dockerUrl(url) {
  const u = new URL(url)
  if (['localhost', '127.0.0.1', '::1'].includes(u.hostname)) u.hostname = 'host.docker.internal'
  return u.toString()
}

function withDatabase(url, name) {
  const u = new URL(url)
  u.pathname = `/${name}`
  return u.toString()
}

/** host:port/db, without credentials. */
function describe(url) {
  const u = new URL(url)
  return `${u.hostname}:${u.port || 5432}${u.pathname}`
}

function step(msg) {
  console.log(`\n→ ${msg}`)
}

function fail(msg) {
  console.error(`\n✖ ${msg}`)
  process.exit(1)
}
