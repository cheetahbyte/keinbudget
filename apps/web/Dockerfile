FROM oven/bun:1.3.13-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
COPY packages/auth/package.json packages/auth/
COPY packages/contracts/package.json packages/contracts/
COPY packages/db/package.json packages/db/
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
RUN bun install --frozen-lockfile
COPY package.json tsconfig.json ./
COPY packages/auth packages/auth
COPY packages/contracts packages/contracts
COPY packages/db packages/db
COPY apps/web apps/web
WORKDIR /app/apps/web
RUN bun run build

FROM oven/bun:1.3.13-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder --chown=bun:bun /app/apps/web/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=bun:bun /app/apps/web/public ./apps/web/public
USER bun
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["bun", "apps/web/server.js"]
