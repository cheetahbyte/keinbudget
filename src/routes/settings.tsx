import { createFileRoute, redirect } from "@tanstack/react-router";
import { sessionQueryOptions } from "#/lib/session-query";
import { AccountSettings } from "#/sections/settings/AccountSettings";

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
});

function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1">Configure keinbudget</p>
      </div>
      <AccountSettings />
    </main>
  );
}
