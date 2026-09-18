# keinbudget — Agent Guide

## Gerenal Instructions
- Always prefer a solution that includes SSR over CSR

## Stack

- **Runtime:** Node.js >=22.15.0; package manager: Bun 1.4.0
- **Framework:** TanStack Start (SSR) + React 19 + React Compiler (Babel plugin)
- **UI:** Tailwind CSS 4 (`@tailwindcss/vite`), Radix UI, shadcn/new-york components
- **DB:** Drizzle ORM + `postgres` driver + PostgreSQL
- **Auth:** Better Auth (email/password)
- **Validation:** Zod v4
- **Routing:** TanStack Router (file-based, `src/routes/`)
- **Lint/Format:** Biome 2 (auto-organizes imports on save)
- **Test:** Vitest

## Key Commands

| command | what |
|---|---|
| `bun run dev` | dev server on port 3000 |
| `bun run build` | production build |
| `bun run test` | vitest (unit tests only, no DB needed) |
| `bun run lint` | `biome check .` |
| `bun run format` | `biome format --write .` |
| `bun run db:generate` | generate Drizzle migration |
| `bun run db:push` | push schema directly (no migration file) |
| `bun run db:migrate` | apply pending migrations |

Required order: `bun run lint && bun run build && bun run test`

Install with `bun install --frozen-lockfile`. Use `bun run test`, not Bun's built-in `bun test`.

## Architecture

```
src/
  routes/          — TanStack Router file-based routes (routeTree.gen.ts is auto-generated)
  features/        — per-feature server actions: actions.ts, repo.ts, service.ts
  db/schema/       — Drizzle schema (auth, categories, subscriptions)
  schemas/         — Zod validation schemas (shared client/server)
  lib/             — shared utils, auth, dashboard queries/mutations
  components/      — shadcn-style components in ui/, custom in dashboard/
  sections/        — page-level section components
```

- Path aliases: `#/*` and `@/*` both map to `./src/*`
- `src/routes/api/auth/$.ts` is the Better Auth API catch-all handler
- `#/server/auth/session` (via `requireSession`) is a TanStack Start generated server-only module — not present in source tree

## Pattern

- Server actions (`createServerFn`) in `features/*/actions.ts`
- DB queries in `features/*/repo.ts`, business logic in `features/*/service.ts`
- Zod schemas are the single source of truth — shared between client form parsing and server input validation
- Drizzle schemas in `db/schema/` are also used as Better Auth adapter schema

## DB & Auth for Dev

- Default: `postgres://postgres:postgres@localhost:5432/keinbudget`
- Start via Docker Compose: `docker compose up -d`
- Better Auth defaults to `http://localhost:3000`, dev-only secret if unset
- `DISABLE_SIGNUP=true` env var blocks registration

## Tests

- Unit tests only (no DB required)
- Test files co-located with source (`*.test.ts`)
- Run: `bun run test`

## Docker

- Multi-stage build (builder + runner)
- Production entrypoint: `node server/index.mjs`
- Container runs `read_only: true` with tmpfs for `/tmp` and dropped capabilities
