# syntax=docker/dockerfile:1

# ---- base -------------------------------------------------------------------
# Shared base with pnpm available via corepack.
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.11.0 --activate
WORKDIR /app

# ---- deps -------------------------------------------------------------------
# Install dependencies against the lockfile only, for maximum layer caching.
# The pnpm store lives in a BuildKit cache mount, so when the lockfile changes
# only new or updated packages are downloaded instead of the whole tree.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store

# ---- dev --------------------------------------------------------------------
# Used by docker-compose for local development. Source is bind-mounted and
# node_modules lives in a named volume at run time, so deps are NOT baked here:
# a bind-mounted /app shadows any image-baked node_modules, so it could never
# seed the volume anyway. docker-compose installs deps on first start (see its
# `command`). This stage only needs Node + pnpm.
FROM base AS dev
ENV NODE_ENV=development
# Media uploads transcode videos with ffmpeg (src/payload/hooks/process-media-upload.ts).
RUN apk add --no-cache ffmpeg
EXPOSE 3000
CMD ["pnpm", "dev"]

# ---- migrator ---------------------------------------------------------------
# Runs Payload database migrations at deploy time. Carries the full dependency
# tree plus source (the config and src/migrations) but does NOT run `next build`,
# so it builds fast. The one-off `migrate` service in docker-compose.prod.yml
# uses this stage and the app waits for it. Auto schema-push is disabled in
# production, so migrations are the only way schema changes reach the prod DB.
FROM base AS migrator
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["pnpm", "run", "migrate"]

# ---- builder ----------------------------------------------------------------
# Produces the standalone production build.
FROM base AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The build needs no database and no secrets: CMS routes render at request
# time. These public values are read at build time, though: NEXT_PUBLIC_* is
# inlined into the bundles, next.config.ts turns R2_PUBLIC_URL into the image
# allowlist, and static pages (home, robots.txt) bake in the site URL and the
# Umami tracker. Pass the same values as at runtime.
ARG NEXT_PUBLIC_SERVER_URL
ARG R2_PUBLIC_URL
ARG UMAMI_ENABLED
ARG UMAMI_WEBSITE_ID
ARG UMAMI_DOMAINS
# Keep .next/cache (Turbopack's build cache) in a BuildKit cache mount. `COPY . .`
# invalidates this layer on every push, so without the mount each build starts
# cold; with it, unchanged modules are reused from the previous build.
RUN --mount=type=cache,id=next-build-cache,target=/app/.next/cache \
    pnpm build

# ---- runner -----------------------------------------------------------------
# Minimal production image running the standalone server as a non-root user.
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Media uploads transcode videos with ffmpeg (src/payload/hooks/process-media-upload.ts).
RUN apk add --no-cache ffmpeg
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
