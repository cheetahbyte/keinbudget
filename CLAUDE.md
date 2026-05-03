@AGENTS.md
Default to using pnpm for package management in this repository.

- Use `pnpm install` for dependency installation.
- Use `pnpm run <script>` and `pnpm --filter <workspace> <script>` for workspace commands.
- The web app runs on Node.js 22.
- The API runtime uses Bun with Hono.
- Bun-specific APIs should stay isolated to `apps/api`.

## Runtime

- The web app uses TanStack Start with Vite and Nitro.
- The API runs on Hono and exports a Bun `fetch` handler.
- The database package uses Drizzle ORM with the `postgres` driver.

## Environment

- Do not assume `.env` files are auto-loaded outside Bun.
- Prefer explicit environment wiring in scripts, Docker, or Compose.
