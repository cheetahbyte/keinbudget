import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import {
  monthlyProjectionsQueryOptions,
  subscriptionsQueryOptions,
} from "#/lib/dashboard/queries";
import { sessionQueryOptions } from "#/lib/session-query";
import { StatsSection } from "#/sections/StatsSection";
import { UpcomingRenewals } from "#/sections/UpcomingRenewals";

export const Route = createFileRoute("/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    period?: "daily" | "monthly" | "yearly";
  } => ({
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
    await Promise.all([
      context.queryClient.ensureQueryData(monthlyProjectionsQueryOptions()),
      context.queryClient.ensureQueryData(subscriptionsQueryOptions()),
    ]);
  },
  head: () => ({ meta: [{ title: "Overview · keinbudget" }] }),
  component: OverviewPage,
});

function OverviewPage() {
  const { period = "monthly" } = Route.useSearch();
  const { data: projections } = useSuspenseQuery(
    monthlyProjectionsQueryOptions(),
  );
  const { data: subscriptions } = useSuspenseQuery(subscriptionsQueryOptions());

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12">
      <StatsSection projections={projections} period={period} />
      <UpcomingRenewals subscriptions={subscriptions} />
    </main>
  );
}
