FROM node:22-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG VITE_BETTER_AUTH_URL=http://localhost:3000
ENV VITE_BETTER_AUTH_URL=$VITE_BETTER_AUTH_URL

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM cgr.dev/chainguard/node AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/dist ./

EXPOSE 3000

CMD ["node", "server/index.mjs"]
