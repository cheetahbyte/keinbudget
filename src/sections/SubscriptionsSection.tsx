import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AddSubscriptionDialog } from "#/components/dashboard/AddSubscriptionDialog";
import { Button } from "#/components/ui/button";
import {
  createSubscription,
  deleteSubscription,
  updateSubscription,
} from "#/functions/subscriptions";
import type { CategoryType } from "#/lib/category-type";
import {
  parseCreateSubscriptionFormData,
  parseEntityIdFormData,
  parseUpdateSubscriptionFormData,
} from "#/lib/dashboard/mutations";
import { dashboardQueryKeys } from "#/lib/dashboard/queries";
import type { Category, Subscription } from "#/lib/dashboard/types";
import { SubscriptionsTable } from "./subscriptions/SubscriptionsTable";

export type SubscriptionFilter = "all" | CategoryType;

export const SUBSCRIPTION_FILTERS: ReadonlyArray<{
  value: SubscriptionFilter;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "expense", label: "Expenses" },
  { value: "savings", label: "Savings" },
  { value: "income", label: "Income" },
];

export function filterSubscriptionsByType(
  subscriptions: Subscription[],
  filter: SubscriptionFilter,
): Subscription[] {
  if (filter === "all") return subscriptions;
  return subscriptions.filter(
    (subscription) => (subscription.category?.type ?? "expense") === filter,
  );
}

interface ActiveSubscriptionsProps {
  categories: Category[];
  subscriptions: Subscription[];
}

export function ActiveSubscriptions({
  categories,
  subscriptions,
}: ActiveSubscriptionsProps) {
  const queryClient = useQueryClient();
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [filter, setFilter] = useState<SubscriptionFilter>("all");

  const filteredSubscriptions = filterSubscriptionsByType(
    subscriptions,
    filter,
  );
  const isFilteredEmpty =
    filteredSubscriptions.length === 0 && subscriptions.length > 0;

  function openCreateSubscription() {
    setEditingSubscription(null);
    setIsSubscriptionOpen(true);
  }

  function openEditSubscription(subscription: Subscription) {
    setEditingSubscription(subscription);
    setIsSubscriptionOpen(true);
  }

  async function handleSubmitSubscription(formData: FormData) {
    if (editingSubscription) {
      const input = parseUpdateSubscriptionFormData(formData);
      if (!input) return;
      await updateSubscription({ data: input });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.subscriptions(),
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.projections(),
        }),
      ]);
    } else {
      const input = parseCreateSubscriptionFormData(formData);
      if (!input) return;
      await createSubscription({ data: input });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.subscriptions(),
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.projections(),
        }),
      ]);
    }
  }

  async function handleDeleteSubscription(formData: FormData) {
    const input = parseEntityIdFormData(formData);
    if (!input) return;
    await deleteSubscription({ data: { id: input.id } });
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.subscriptions(),
      }),
      queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.projections(),
      }),
    ]);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <div className="flex w-full flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-2xl font-medium tracking-tight">
            Recurring entries
          </h1>
          <Button className="cursor-pointer" onClick={openCreateSubscription}>
            <Plus data-icon="inline-start" />
            Add entry
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="subscription-type-filter" className="sr-only">
            Filter by type
          </label>
          <select
            id="subscription-type-filter"
            className="h-9 rounded-md border border-input bg-card px-3 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as SubscriptionFilter)
            }
          >
            {SUBSCRIPTION_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">
            {filteredSubscriptions.length} of {subscriptions.length} entries
          </p>
        </div>
      </div>

      {isFilteredEmpty ? (
        <p className="text-muted-foreground">No entries of this type yet.</p>
      ) : (
        <SubscriptionsTable
          key={`sub-${filter}`}
          deleteSubscriptionAction={handleDeleteSubscription}
          onEdit={openEditSubscription}
          subscriptions={filteredSubscriptions}
        />
      )}

      <AddSubscriptionDialog
        categories={categories}
        open={isSubscriptionOpen}
        onOpenChange={(open) => {
          setIsSubscriptionOpen(open);
          if (!open) setEditingSubscription(null);
        }}
        onSubmit={handleSubmitSubscription}
        subscription={editingSubscription ?? undefined}
      />
    </div>
  );
}
