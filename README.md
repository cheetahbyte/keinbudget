# keinbudget
Track your subscriptions
![alt text](docs/screenshot.png)

## Self-Hosting
Just execute the `compose.yaml`

```sh
$ docker compose up -d
```

For local Docker Compose usage, the auth stack defaults to `http://localhost:3000` and falls back to a development-only `BETTER_AUTH_SECRET` if none is provided. Set your own `BETTER_AUTH_SECRET` before building for any non-local deployment.

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
