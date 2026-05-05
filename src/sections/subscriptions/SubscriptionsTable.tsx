import { Pencil, Shapes, Trash2 } from "lucide-react";

import { PaginationControls } from "#/components/dashboard/PaginationControls";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { usePaginatedItems } from "#/hooks/usePaginatedItems";
import { getBillingIntervalShortLabel } from "#/lib/billing-interval";
import type { Subscription } from "#/lib/dashboard/types";

interface SubscriptionsTableProps {
  deleteSubscriptionAction: (formData: FormData) => Promise<void>;
  onEdit: (subscription: Subscription) => void;
  subscriptions: Subscription[];
}

export function SubscriptionsTable({
  deleteSubscriptionAction,
  onEdit,
  subscriptions,
}: SubscriptionsTableProps) {
  const {
    currentPage,
    pageItems,
    pageSize,
    setCurrentPage,
    setPageSize,
    totalPages,
    visibleItems: visibleSubscriptions,
  } = usePaginatedItems(subscriptions);

  if (subscriptions.length === 0) {
    return (
      <Card className="rounded-[2rem] border border-dashed border-[#d7c8b3] bg-[#fdf8f1] py-0 shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-3 px-8 py-14 text-center">
          <div className="flex size-16 items-center justify-center rounded-[1.5rem] bg-[#f2e1c7] text-[#5d4b3c]">
            <Shapes className="size-8" />
          </div>
          <h3 className="text-2xl font-semibold text-[#2e241d]">
            No subscriptions yet
          </h3>
          <p className="max-w-xl text-base text-[#75685f]">
            Create your first category and subscription above to start tracking
            recurring costs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card/50">
        {visibleSubscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="flex items-center justify-between gap-4 border-border px-5 py-4 not-last:border-b"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-lg">
                {subscription.category?.icon ?? "🧾"}
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {subscription.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {subscription.category?.name ?? "Uncategorized"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-mono text-sm text-foreground">
                  {subscription.price.toFixed(2)}
                  <span className="ml-1 text-xs text-muted-foreground">
                    EUR
                  </span>
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {getBillingIntervalShortLabel(subscription.billingInterval)}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => onEdit(subscription)}
              >
                <Pencil className="size-3.5" />
                <span className="sr-only">Edit {subscription.name}</span>
              </Button>

              <form action={deleteSubscriptionAction}>
                <input type="hidden" name="id" value={subscription.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Delete {subscription.name}</span>
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
      <PaginationControls
        anchorId="subscriptions"
        currentPage={currentPage}
        pageItems={pageItems}
        pageSize={pageSize}
        totalPages={totalPages}
        rowsPerPageId="select-rows-per-page"
        onPageChange={setCurrentPage}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
