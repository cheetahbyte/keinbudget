FROM node:22-alpine AS deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY packages/auth/package.json packages/auth/
COPY packages/contracts/package.json packages/contracts/
COPY packages/db/package.json packages/db/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

RUN pnpm install --frozen-lockfile

FROM oven/bun:1.3.13-alpine

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /app/packages/auth/package.json packages/auth/package.json
COPY --from=deps /app/packages/auth/node_modules packages/auth/node_modules
COPY --from=deps /app/packages/contracts/package.json packages/contracts/package.json
COPY --from=deps /app/packages/contracts/node_modules packages/contracts/node_modules
COPY --from=deps /app/packages/db/package.json packages/db/package.json
COPY --from=deps /app/packages/db/node_modules packages/db/node_modules
COPY --from=deps /app/apps/api/package.json apps/api/package.json
COPY --from=deps /app/apps/api/node_modules apps/api/node_modules
COPY packages/auth packages/auth
COPY packages/contracts packages/contracts
COPY packages/db packages/db
COPY apps/api apps/api

EXPOSE 4000
CMD ["bun", "run", "apps/api/src/index.ts"]
