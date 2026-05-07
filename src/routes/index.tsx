import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "#/lib/auth.functions";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { user: session.user };
  },
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(subscriptionsQueryOptions()),
      context.queryClient.ensureQueryData(categoriesQueryOptions()),
      context.queryClient.ensureQueryData(subscriptionStatsQueryOptions()),
      context.queryClient.ensureQueryData(settingsQueryOptions()),
    ]);
  },
  component: Home,
});

function Home() {
  return <DashboardPage />;
}

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  categoriesQueryOptions,
  subscriptionStatsQueryOptions,
  subscriptionsQueryOptions,
} from "#/lib/dashboard/queries";
import { buildBreakdownItems } from "#/lib/dashboard/utils";
import { settingsQueryOptions } from "#/lib/settings/queries";
import { StatsSection } from "#/sections/StatsSection";
import { ActiveSubscriptions } from "#/sections/SubscriptionsSection";

function DashboardPage() {
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
  const { data: stats } = useSuspenseQuery(subscriptionStatsQueryOptions());
  const { data: subscriptions } = useSuspenseQuery(subscriptionsQueryOptions());
  const { data: preferences } = useSuspenseQuery(settingsQueryOptions());

  const currency = preferences?.currency ?? "EUR";
  const comparisonItem = {
    name: preferences?.comparisonItemName ?? "burger",
    price: preferences?.comparisonItemPrice ?? 8,
  };
  const breakdownStats = buildBreakdownItems(subscriptions);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section id="stats">
        <StatsSection
          breakdownStats={breakdownStats}
          comparisonItem={comparisonItem}
          currency={currency}
          stats={stats}
        />
      </section>
      <div className="mb-5 mt-10" />
      <section className="space-y-6">
        <ActiveSubscriptions
          categories={categories}
          currency={currency}
          subscriptions={subscriptions}
        />
      </section>
    </main>
  );
}
