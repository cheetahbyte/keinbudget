import { createFileRoute, redirect } from "@tanstack/react-router";

import { sessionQueryOptions } from "#/lib/session-query";
import { preferencesQueryOptions } from "#/lib/settings/queries";
import { AccountSettings } from "#/sections/settings/AccountSettings";
import { LocalizationSettings } from "#/sections/settings/LocalizationSettings";

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
    await context.queryClient.ensureQueryData(preferencesQueryOptions());
  },
});

function SettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
      <LocalizationSettings />
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
