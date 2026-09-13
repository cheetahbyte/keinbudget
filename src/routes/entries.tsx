import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  categoriesQueryOptions,
  subscriptionsQueryOptions,
} from "#/lib/dashboard/queries";
import { sessionQueryOptions } from "#/lib/session-query";
import { ActiveSubscriptions } from "#/sections/SubscriptionsSection";

export const Route = createFileRoute("/entries")({
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
      context.queryClient.ensureQueryData(categoriesQueryOptions()),
      context.queryClient.ensureQueryData(subscriptionsQueryOptions()),
    ]);
  },
  head: () => ({ meta: [{ title: "Recurring entries · keinbudget" }] }),
  component: EntriesPage,
});

function EntriesPage() {
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
  const { data: subscriptions } = useSuspenseQuery(subscriptionsQueryOptions());

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <ActiveSubscriptions
        categories={categories}
        subscriptions={subscriptions}
      />
    </main>
  );
}
