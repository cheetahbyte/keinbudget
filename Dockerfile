FROM node:22-alpine AS builder

COPY --from=oven/bun:1.4.0-alpine /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app
COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM cgr.dev/chainguard/node AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/dist ./

EXPOSE 3000

CMD ["server/index.mjs"]
