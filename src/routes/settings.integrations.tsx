import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { getBaseURL } from "#/lib/auth";
import { connectedAppsQueryOptions } from "#/lib/settings/queries";
import { ConnectedAppsSettings } from "#/sections/settings/ConnectedAppsSettings";
import { McpSettings } from "#/sections/settings/McpSettings";

const getPublicBaseUrl = createServerFn({ method: "GET" }).handler(() =>
  getBaseURL(),
);

export const Route = createFileRoute("/settings/integrations")({
  component: IntegrationsPage,
  head: () => ({ meta: [{ title: "Integrations · Settings · keinbudget" }] }),
  loader: async ({ context }) => {
    const [baseUrl] = await Promise.all([
      getPublicBaseUrl(),
      context.queryClient.ensureQueryData(connectedAppsQueryOptions()),
    ]);
    return { baseUrl };
  },
});

function IntegrationsPage() {
  const { baseUrl } = Route.useLoaderData();
  return (
    <>
      <McpSettings baseUrl={baseUrl} />
      <ConnectedAppsSettings />
    </>
  );
}
