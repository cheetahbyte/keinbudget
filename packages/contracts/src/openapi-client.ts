import { createORPCClient } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import type { ContractRouterClient } from "@orpc/contract";
import { subscriptionContract } from "./subscription";

const appRouter = { subscriptions: subscriptionContract };
type AppRouter = typeof appRouter;

export function createOpenAPIClient(baseUrl: string) {
  return createORPCClient<ContractRouterClient<AppRouter>>(
    new OpenAPILink(appRouter, { url: baseUrl })
  );
}
