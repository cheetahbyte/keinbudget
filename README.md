# keinbudget
Track your subscriptions
![alt text](<docs/screenshot.png)
## Self-Hosting
Just execute the `compose.yaml` 
```sh
$ docker compose up -d
```


## Techstack
- Bun workspaces for the monorepo and package management
- Next.js 16 + React 19 for the web app
- Tailwind CSS 4, Radix UI, and shadcn-style components for the UI
- Hono for the API
- oRPC + Zod for shared contracts and type-safe API calls
- Drizzle ORM with PostgreSQL for the database layer
- Better Auth for authentication
- Docker Compose for simple self-hosting
