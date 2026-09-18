import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { monthlyProjectionsQueryOptions } from "#/lib/dashboard/queries";
import { sessionQueryOptions } from "#/lib/session-query";
import { StatsSection } from "#/sections/StatsSection";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData({
      ...sessionQueryOptions(),
      revalidateIfStale: true,
    });
    if (!session) throw redirect({ to: "/login" });
    return { user: session.user };
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(monthlyProjectionsQueryOptions());
  },
  head: () => ({ meta: [{ title: "Overview · keinbudget" }] }),
  component: OverviewPage,
});

function OverviewPage() {
  const { data: projections } = useSuspenseQuery(
    monthlyProjectionsQueryOptions(),
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col px-6 py-12">
      <StatsSection projections={projections} />
    </main>
  );
}
