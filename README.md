# keinbudget

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.13. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

Server Component — direct await:
  // app/subscriptions/page.tsx
  import { api } from "@/lib/api";

  export default async function Page() {
    const subscriptions = await api.subscriptions.all();
    // ...
  }

  Client Component — via orpc utils:
  "use client";
  import { useQuery } from "@tanstack/react-query";
  import { orpc } from "@/lib/orpc";

  export function SubscriptionList() {
    const { data, isPending } = useQuery(orpc.subscriptions.all.queryOptions());
    if (isPending) return <p>Loading...</p>;
    return <ul>{data?.map(s => <li key={s.id}>{s.name}</li>)}</ul>;
  }

  The orpc object mirrors your contract structure exactly, so orpc.subscriptions.all gives you queryOptions(), mutationOptions(), and getQueryKey() — all fully typed.
