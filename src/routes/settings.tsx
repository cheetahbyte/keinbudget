import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "#/lib/auth.functions";
import { AccountSettings } from "#/sections/settings/AccountSettings";
import { LocalizationSettings } from "#/sections/settings/LocalizationSettings";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  beforeLoad: async () => {
    const session = await getSession();
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
      {/*<LocalizationSettings />*/}
      <AccountSettings />
    </main>
  );
}
