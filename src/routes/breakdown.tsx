import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { Breakdown } from "#/components/Breakdown";
import { subscriptionsQueryOptions } from "#/lib/dashboard/queries";
import { buildBreakdownItems } from "#/lib/dashboard/utils";
import { sessionQueryOptions } from "#/lib/session-query";

export const Route = createFileRoute("/breakdown")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { period?: "daily" | "monthly" | "yearly" } => ({
    period:
      search.period === "daily" || search.period === "yearly"
        ? search.period
        : undefined,
  }),
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData({
      ...sessionQueryOptions(),
      revalidateIfStale: true,
    });
    if (!session) throw redirect({ to: "/login" });
    return { user: session.user };
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(subscriptionsQueryOptions());
  },
  head: () => ({ meta: [{ title: "Breakdown · keinbudget" }] }),
  component: BreakdownPage,
});

function BreakdownPage() {
  const { period = "monthly" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: subscriptions } = useSuspenseQuery(subscriptionsQueryOptions());

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight">Breakdown</h1>
      <Breakdown
        items={buildBreakdownItems(subscriptions)}
        period={period}
        onPeriodChange={(period) => void navigate({ search: { period } })}
      />
    </main>
  );
}
