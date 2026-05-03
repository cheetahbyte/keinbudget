FROM oven/bun:1.3.13-alpine
WORKDIR /app
RUN mkdir -p /data && chown bun:bun /data
COPY --chown=bun:bun package.json bun.lock tsconfig.json ./
COPY --chown=bun:bun packages/auth/package.json packages/auth/
COPY --chown=bun:bun packages/contracts/package.json packages/contracts/
COPY --chown=bun:bun packages/db/package.json packages/db/
COPY --chown=bun:bun apps/api/package.json apps/api/
COPY --chown=bun:bun apps/web/package.json apps/web/
RUN bun install --frozen-lockfile
COPY --chown=bun:bun packages/auth packages/auth
COPY --chown=bun:bun packages/contracts packages/contracts
COPY --chown=bun:bun packages/db packages/db
COPY --chown=bun:bun apps/api apps/api
USER bun
EXPOSE 4000
CMD ["bun", "run", "apps/api/src/index.ts"]
