import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { getBaseURL } from "#/lib/auth";
import { sessionQueryOptions } from "#/lib/session-query";
import {
  connectedAppsQueryOptions,
  preferencesQueryOptions,
} from "#/lib/settings/queries";
import { AccountSettings } from "#/sections/settings/AccountSettings";
import { ConnectedAppsSettings } from "#/sections/settings/ConnectedAppsSettings";
import { LocalizationSettings } from "#/sections/settings/LocalizationSettings";
import { McpSettings } from "#/sections/settings/McpSettings";
import { PasskeySettings } from "#/sections/settings/PasskeySettings";

const getPublicBaseUrl = createServerFn({ method: "GET" }).handler(() =>
  getBaseURL(),
);

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings · keinbudget" }] }),
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData({
      ...sessionQueryOptions(),
      revalidateIfStale: true,
    });
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { user: session.user };
  },
  loader: async ({ context }) => {
    const [baseUrl] = await Promise.all([
      getPublicBaseUrl(),
      context.queryClient.ensureQueryData(preferencesQueryOptions()),
      context.queryClient.ensureQueryData(connectedAppsQueryOptions()),
    ]);
    return { baseUrl };
  },
});

function SettingsPage() {
  const { baseUrl } = Route.useLoaderData();
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
      <LocalizationSettings />
      <PasskeySettings />
      <McpSettings baseUrl={baseUrl} />
      <ConnectedAppsSettings />
      <AccountSettings />
      <p className="text-sm text-muted-foreground">
        Version:{" "}
        <code title={import.meta.env.VITE_COMMIT_SHA}>
          {import.meta.env.VITE_COMMIT_SHA.slice(0, 7)}
        </code>
      </p>
    </main>
  );
}
