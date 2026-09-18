import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { categoriesQueryOptions } from "#/lib/dashboard/queries";
import { sessionQueryOptions } from "#/lib/session-query";
import { CategoriesSection } from "#/sections/CategoriesSection";

export const Route = createFileRoute("/categories")({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData({
      ...sessionQueryOptions(),
      revalidateIfStale: true,
    });
    if (!session) throw redirect({ to: "/login" });
    return { user: session.user };
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoriesQueryOptions());
  },
  head: () => ({ meta: [{ title: "Categories · keinbudget" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <CategoriesSection categories={categories} />
    </main>
  );
}
