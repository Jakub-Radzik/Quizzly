FROM node:22-alpine AS base

# 1. Install the dependencies
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY next-app/package.json next-app/package-lock.json ./
RUN npm ci

# 2. Build the application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY next-app/. .
COPY .env .env
RUN npm run build


# 3. Production image, copy files and run next
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
ENV PORT=3000
CMD HOSTNAME="0.0.0.0" node server.js
