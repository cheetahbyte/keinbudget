# keinbudget
Track your subscriptions
![alt text](docs/screenshot.png)

## Self-Hosting
Just execute the `compose.yaml`

```sh
$ docker compose up -d
```

Runs on port `3000` with a Postgres 17 database. Data is persisted in a named volume.

For non-local deployments, set these environment variables before building:

| Variable | Default | Notes |
|---|---|---|
| `BETTER_AUTH_SECRET` | `dev-only-change-me` | **Required in production** — set a strong secret |
| `BETTER_AUTH_URL` | `http://localhost:3000` | Public URL of your instance |
| `VITE_BETTER_AUTH_URL` | `http://localhost:3000` | Build-time URL — must match `BETTER_AUTH_URL` |
| `POSTGRES_USER` | `keinbudget` | |
| `POSTGRES_PASSWORD` | `keinbudget` | |
| `POSTGRES_DB` | `keinbudget` | |
| `DISABLE_SIGNUP` | `false` | Set to `true` to lock registration after setup |

## Development
Install dependencies and run with `pnpm` on Node 22:

```sh
pnpm install
pnpm dev
```

## Techstack
- pnpm on Node.js 22
- Tanstack Start + React 19 for the web app
- Tailwind CSS 4, Radix UI, and shadcn-style components for the UI
- Drizzle ORM with `postgres` and PostgreSQL for the database layer
- Better Auth for authentication
- Docker Compose for simple self-hosting
