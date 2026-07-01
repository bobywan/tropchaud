FROM node:24-alpine AS base

# ─── Dépendances ───────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# ─── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

# URL publique inlinée dans le bundle JS au build — passée via --build-arg en CI
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN ./node_modules/.bin/prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── Migrator (deps complets pour prisma migrate deploy) ───────────────────────
FROM base AS migrator
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY prisma.config.ts .

CMD ["/bin/sh", "-c", "node_modules/.bin/prisma migrate deploy"]

# ─── Seeder (crée/met à jour le compte admin) ──────────────────────────────────
FROM base AS seeder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/app/generated ./app/generated
COPY prisma ./prisma
COPY prisma.config.ts .

CMD ["node_modules/.bin/tsx", "prisma/seed.ts"]

# ─── Production ────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/app/generated ./app/generated

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
