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
    ]);
  },
  component: Home,
});

function Home() {
  return <DashboardPage />;
}

import { useSuspenseQuery } from "@tanstack/react-query";
import { useDashboardActions } from "#/hooks/useDashboardActions";
import {
  categoriesQueryOptions,
  subscriptionStatsQueryOptions,
  subscriptionsQueryOptions,
} from "#/lib/dashboard/queries";
import { buildBreakdownItems } from "#/lib/dashboard/utils";
import { StatsSection } from "#/sections/StatsSection";
import { ActiveSubscriptions } from "#/sections/SubscriptionsSection";

export function DashboardPage() {
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
  const { data: stats } = useSuspenseQuery(subscriptionStatsQueryOptions());
  const { data: subscriptions } = useSuspenseQuery(subscriptionsQueryOptions());
  const {
    createCategory,
    createSubscription,
    deleteCategory,
    deleteSubscription,
  } = useDashboardActions();

  const breakdownStats = buildBreakdownItems(subscriptions);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section id="stats">
        <StatsSection breakdownStats={breakdownStats} stats={stats} />
      </section>
      <div className="mb-5 mt-10" />
      <section className="space-y-6">
        <ActiveSubscriptions
          categories={categories}
          createCategoryAction={createCategory}
          createSubscriptionAction={createSubscription}
          deleteCategoryAction={deleteCategory}
          deleteSubscriptionAction={deleteSubscription}
          subscriptions={subscriptions}
        />
      </section>
    </main>
  );
}
