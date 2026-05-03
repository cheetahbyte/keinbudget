FROM oven/bun:1.3.13-alpine AS builder

WORKDIR /app

COPY package.json bun.lock tsconfig.json ./
COPY packages/auth/package.json packages/auth/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/db/package.json packages/db/package.json
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN bun install
RUN ln -s "$(readlink apps/web/node_modules/nitro | sed 's#^../../../node_modules/##')" node_modules/nitro

COPY packages/auth packages/auth
COPY packages/contracts packages/contracts
COPY packages/db packages/db
COPY apps/web apps/web

RUN bun run --filter @keinbudget/web build

FROM oven/bun:1.3.13-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/apps/web/.output ./

EXPOSE 3000

CMD ["bun", "server/index.mjs"]
