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

## Passkeys

Users can add passkeys (Touch ID, Face ID, Windows Hello, security keys) under Settings and sign in with them on the login page. The WebAuthn relying party is derived from `BETTER_AUTH_URL`: its hostname is the RP ID and the full origin is the allowed origin, so that variable must match the URL users open in the browser. Passkeys registered on one hostname do not work on another.

## MCP

keinbudget is an MCP server. Point an MCP client (Claude, Cursor, ChatGPT, ...) at `https://<your-host>/api/mcp`. The client discovers the built-in OAuth 2.1 authorization server, registers itself through a Client ID Metadata Document, opens the login and consent pages in the browser, and then calls tools with a short-lived access token bound to your account.

Scopes:

| scope | grants |
|---|---|
| `budget:read` | `list_entries`, `list_categories`, `get_monthly_overview`, `upcoming_renewals` |
| `budget:write` | `create_entry`, `update_entry`, `delete_entry`, `create_category`, `update_category`, `delete_category` |

Connected apps are listed under Settings. Revoking one deletes its consent and revokes its refresh tokens; the MCP endpoint also checks the consent on every call, so an app loses access at once even though its current access token is still cryptographically valid.

### Security properties

- Access tokens are JWTs valid for 10 minutes; refresh tokens for 30 days. PKCE is required for every client.
- Only the scopes above can be requested or registered. Consent is per client and shown with the client's registered name and URL.
- Client ID Metadata Documents are fetched only from `https` URLs with a path, without following redirects, with a 5 s timeout and a 5 KB limit. On Node (Docker) the fetcher resolves DNS once and pins the address. On Cloudflare Workers the runtime cannot reach private addresses, and the `global_fetch_strictly_public` compatibility flag in `wrangler.toml` stops `fetch` from short-circuiting to this zone's origin, which is the same setup Cloudflare's own `workers-oauth-provider` uses.
- Rate limiting stores counters in the `rate_limit` table so limits hold across Workers isolates.
- Discovery documents are served at `/.well-known/oauth-authorization-server` and `/.well-known/oauth-protected-resource`, so the app must be reachable at the root of its origin. Signing keys for access tokens are generated on first use and stored in the `jwks` table; back it up with the rest of the database.

## Cloudflare Workers deployment

The app can be deployed as a Cloudflare Worker (SSR included) that talks directly to an external PostgreSQL database over TCP (`postgres` driver + `connect()` sockets, so **no Hyperdrive binding is required**). The Node/Docker path above keeps working unchanged — `bun run build` still builds the Node server, `bun run build:cf` builds the Worker.

### Prerequisites

- A Cloudflare account and a PostgreSQL instance reachable from the internet (public hostname, port `5432`)
- Logged in locally: `bun run wrangler login`

### Build and deploy

```sh
# build the Worker bundle (nitro `cloudflare_module` preset)
bun run build:cf

# set secrets/vars once (or use the Cloudflare dashboard > Settings > Variables)
bun run wrangler secret put DATABASE_URL
bun run wrangler secret put BETTER_AUTH_SECRET
bun run wrangler secret put BETTER_AUTH_URL
bun run wrangler secret put DISABLE_SIGNUP

# deploy
bun run deploy:cf
```

Set `BETTER_AUTH_URL` to your deployed HTTPS origin and `BETTER_AUTH_SECRET` to a strong random secret. The browser auth client uses the current origin; no build-time auth URL is needed.

Before serving traffic, apply the database migrations from your local machine or CI with `DATABASE_URL` set to your PostgreSQL connection string:

```sh
bun run db:migrate
```

Use your provider's TLS-enabled connection string. Never commit it.

### Local preview (workerd)

Create a `.dev.vars` file (gitignored) with the same variables as above, then:

```sh
bun run preview:cf
```

### How it works / limitations

- The Worker runs on Nitro's `cloudflare_module` preset with the `nodejs_compat` compatibility flag
- Workers only exposes env vars inside the request lifecycle and closes TCP sockets when the request ends — so on Workers the DB client and Better Auth instance are created **per request**, keyed by the request context (TanStack Start's AsyncLocalStorage). No client state is cached across requests. On Node (`bun run dev`, Docker) one shared client per process is kept, as before
- There is no connection pooling across requests on Workers. Idle connections close after 30s (`idle_timeout`); Workers additionally tears down all sockets at request end. Add a [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) binding if you want pooled connections and query caching — postgres.js accepts its connection string as-is
- Development and Docker deployments still use Node.js

## Development
Install Bun 1.4.0 and Node.js 22, then install dependencies and start the app:

```sh
bun install --frozen-lockfile
bun run dev
```

Run checks with `bun run lint && bun run build && bun run test`. Use `bun run test`, not `bun test`, to run Vitest.

In the Cloudflare dashboard, set the build command to `bun run build:cf` and the build variable `BUN_VERSION` to `1.4.0`.

## Techstack
- Bun for package management, Node.js 22 for the runtime
- Tanstack Start + React 19 for the web app
- Tailwind CSS 4, Radix UI, and shadcn-style components for the UI
- Drizzle ORM with `postgres` and PostgreSQL for the database layer
- Better Auth for authentication
- Docker Compose for simple self-hosting
