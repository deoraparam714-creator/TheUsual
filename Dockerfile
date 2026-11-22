# the usual. — production image. Railway builds this (see railway.json); it runs on any Docker host.

# ── 1. Dependencies
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ── 2. Build a self-contained Next.js server
FROM node:22-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_OUTPUT=standalone
# Absolute URLs (Open Graph, sitemap) are fixed at build time. Both are optional:
# set NEXT_PUBLIC_SITE_URL for a custom domain, otherwise Railway's generated domain is used.
ARG NEXT_PUBLIC_SITE_URL
ARG RAILWAY_PUBLIC_DOMAIN
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── 3. Run
FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
# Orders are saved in /app/data. Mount a persistent volume there.
# The image keeps the default root user because hosts like Railway mount volumes owned by root.
RUN mkdir -p /app/data
EXPOSE 3000
CMD ["node", "server.js"]
