# syntax=docker/dockerfile:1.6

FROM node:25-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

FROM node:25-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max_old_space_size=2048
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,target=/root/.npm npm run build

FROM node:25-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Kopiere standalone server
COPY --from=builder /app/.next/standalone ./

# Kopiere public files
COPY --from=builder /app/public ./public

# ⚠️ KRITISCH: Kopiere static files (wird bei standalone nicht automatisch gemacht!)
COPY --from=builder /app/.next/static ./.next/static

RUN useradd -m nextjs && chown -R nextjs:nextjs /app
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]