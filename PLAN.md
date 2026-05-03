# Migration Plan: apps/website (Next.js) → apps/web (TanStack Start)

## Context

`apps/website` is a working Next.js subscription tracker. `apps/web` is a fresh TanStack Start scaffold. Goal: port all UI, features, and data flows so `apps/web` renders identically to `apps/website`.

---

## Architecture Decisions

| Next.js pattern | TanStack Start replacement |
|---|---|
| `"use server"` server actions | `createServerFn()` |
| `cookies()` from `next/headers` | `getWebRequest()` from `@tanstack/react-start/server` |
| `revalidatePath("/")` | `router.invalidate()` on client after mutation |
| `redirect()` from `next/navigation` | `redirect()` from `@tanstack/react-router` (in loader) |
| `useRouter().push()` | `useNavigate()` from `@tanstack/react-router` |
| `useRouter().refresh()` | `useRouter().invalidate()` from `@tanstack/react-router` |
| `Link` from `next/link` | `Link` from `@tanstack/react-router` |
| `"use client"` directive | Remove — not used in TanStack Start |
| `next/font/google` | Google Fonts `@import url(...)` in CSS |
| Route `page.tsx` data fetch | Route loader (`loader: async () => ...`) |
| `QueryClientProvider` wrapper | Already in `router.tsx` via `root-provider.tsx` |

Data flow: route loader fetches all data server-side → passed to component via `Route.useLoaderData()`. Mutations call server functions then `router.invalidate()` to re-run loader.

---

## Files Modified

### `apps/web/package.json`
Add missing deps (already in workspace):
```json
"@keinbudget/auth": "workspace:*",
"@keinbudget/contracts": "workspace:*",
"@orpc/client": "^1.14.0",
"@orpc/tanstack-query": "^1.14.0"
```

### `apps/web/src/styles.css`
Replace with website's design tokens:
- Replace Google Fonts import with Geist + Geist Mono
- Add `@theme inline` block mapping CSS vars → Tailwind theme (colors, font-sans/mono/heading, radii)
- Replace `:root` CSS vars with website's values (neutral oklch palette)
- Add `.dark` section
- Add `@layer base` with `border-border`, `bg-background`, `font-sans` defaults

### `apps/web/src/components/ui/button.tsx`
Replace with website's version — different `cva` class (adds `group/button`, `border border-transparent`, `data-slot`/`data-variant`/`data-size`, icon inline padding helpers). Both have `icon-sm` size.

### `apps/web/src/routes/__root.tsx`
- Import `Header` from `#/components/header`
- Add `<body className="min-h-full flex flex-col bg-[#FAF8F5] antialiased h-full">` to `RootDocument`
- Update `<title>` to `keinbudget`

### `apps/web/src/routes/index.tsx`
Full dashboard — add loader + `Home` component:
```tsx
export const Route = createFileRoute('/')({
  loader: async () => {
    const api = await getServerApi()
    try {
      const [subscriptions, categories, stats] = await Promise.all([
        api.subscriptions.all(), api.categories.all(), api.subscriptions.stats(),
      ])
      return { subscriptions, categories, stats }
    } catch {
      throw redirect({ to: '/login' })
    }
  },
  component: Home,
})

function Home() {
  const { subscriptions, categories, stats } = Route.useLoaderData()
  const router = useRouter()
  // wrap each action: parse FormData → call server fn → router.invalidate()
  return <main>...</main>
}
```
Port `seededHexColor`, `toMonthlyPrice`, `breakdownStats` logic from `apps/website/src/app/page.tsx`.

---

## Files Created

### UI Components (copy from website, change `@/` → `#/`)
- `src/components/ui/card.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/field.tsx` (depends on separator)
- `src/components/ui/pagination.tsx`
- `src/components/ui/separator.tsx`

### Lib
- `src/lib/api.ts` — `export const api = createClient('http://localhost:4000/rpc')`
- `src/lib/api.server.ts` — uses `getWebRequest()` to get `Cookie` header for ORPC:
  ```ts
  import { getWebRequest } from '@tanstack/react-start/server'
  import { createClient } from '@keinbudget/contracts/client'
  export async function getServerApi() {
    const req = getWebRequest()
    const cookie = req?.headers.get('cookie') ?? req?.headers.get('Cookie') ?? ''
    return createClient(`${process.env.API_URL ?? 'http://localhost:4000'}/rpc`, { Cookie: cookie })
  }
  ```
- `src/lib/auth.ts` — `export { authClient } from '@keinbudget/auth/client'`
- `src/lib/orpc.ts` — `export const orpc = createTanstackQueryUtils(api)`

### Server Functions
`src/server/actions.ts` — four `createServerFn({ method: 'POST' })` functions:
- `createSubscriptionFn` — accepts `{ name, price, billingInterval, categoryId }`
- `createCategoryFn` — accepts `{ name, icon }`
- `deleteSubscriptionFn` — accepts `{ id }`
- `deleteCategoryFn` — accepts `{ id }`
All call `getServerApi()` and make ORPC request. No `revalidatePath` (client handles invalidation).

### Components
- `src/components/header.tsx` — port from website:
  - `import { Link, useNavigate, useRouter } from '@tanstack/react-router'`
  - `useNavigate()` + `router.invalidate()` replaces `useRouter().push/refresh`
  - Remove `"use client"` directive
- `src/components/Breakdown.tsx` — copy as-is (pure React), change `@/` → `#/`

### Sections
Port all from website (remove `"use client"`, change `@/` → `#/`):
- `src/sections/StatsSection.tsx`
- `src/sections/SubscriptionsSection.tsx` — keep `<form action={fn}>` pattern (React 19 form actions work client-side)
- `src/sections/subscriptions/SubscriptionsTable.tsx`
- `src/sections/subscriptions/CategoriesTable.tsx`

### Routes
- `src/routes/login.tsx` — port `apps/website/src/app/login/page.tsx`:
  - `createFileRoute('/login')`, remove `"use client"`
  - Replace `useRouter` with `useNavigate`/`useRouter` from TanStack Router
- `src/routes/signup.tsx` — same pattern as login

---

## Form Action Pattern in Index Route

Since section components use `<form action={asyncFn}>` (React 19 form actions), the Home component defines wrapper handlers that:
1. Extract/validate fields from `FormData`
2. Call the typed server function
3. Call `router.invalidate()` to re-run the loader

```tsx
async function handleCreateSubscription(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const price = Number(formData.get('price'))
  const billingInterval = String(formData.get('billingInterval'))
  const categoryId = formData.get('categoryId') ? Number(formData.get('categoryId')) : null
  if (!name || !Number.isFinite(price) || price <= 0) return
  await createSubscriptionFn({ data: { name, price, billingInterval, categoryId } })
  router.invalidate()
}
```

These handlers are passed to `ActiveSubscriptions` via props (same interface as before).

---

## Verification

1. `bun install` in root — resolve new workspace deps
2. `bun run dev:web` — dev server starts on port 3000
3. Navigate to `/` — should redirect to `/login` (no session)
4. Login with valid credentials → redirected to dashboard
5. Dashboard shows stats, breakdown chart, subscriptions/categories tables
6. Create subscription → appears in table, stats update
7. Delete subscription → removed, stats update
8. Create/delete category → categories table updates
9. Sign out → redirected to `/login`
10. Header shows user email + initials when logged in
