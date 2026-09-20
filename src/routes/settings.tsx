import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { sessionQueryOptions } from "#/lib/session-query";

const tabs = [
  { to: "/settings", label: "General" },
  { to: "/settings/security", label: "Security" },
  { to: "/settings/integrations", label: "Integrations" },
  { to: "/settings/account", label: "Account" },
] as const;

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
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
      <nav
        aria-label="Settings"
        className="flex flex-wrap gap-x-5 gap-y-2 border-b border-border"
      >
        {tabs.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true, includeSearch: false }}
            activeProps={{
              className: "border-pen text-foreground",
              "aria-current": "page",
            }}
            inactiveProps={{
              className:
                "border-transparent text-muted-foreground hover:text-foreground",
            }}
            className="shrink-0 border-b-2 pb-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring"
          >
            {label}
          </Link>
        ))}
      </nav>
      <Outlet />
      <p className="text-sm text-muted-foreground">
        Version:{" "}
        <code title={import.meta.env.VITE_COMMIT_SHA}>
          {import.meta.env.VITE_COMMIT_SHA.slice(0, 7)}
        </code>
      </p>
    </main>
  );
}
