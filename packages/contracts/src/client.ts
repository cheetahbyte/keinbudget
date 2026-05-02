import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";
import type { categoryContract } from "./category";
import type { subscriptionContract } from "./subscription";

type AppRouter = {
  subscriptions: typeof subscriptionContract;
  categories: typeof categoryContract;
};

export function createClient(baseUrl: string, headers?: Record<string, string>) {
  return createORPCClient<ContractRouterClient<AppRouter>>(
    new RPCLink({
      url: baseUrl,
      fetch: (url, opts) =>
        fetch(url, {
          ...(opts as RequestInit | undefined),
          credentials: "omit",
          headers: {
            ...((opts as RequestInit | undefined)?.headers as Record<string, string> | undefined),
            ...headers,
          },
        }),
    })
  );
}
