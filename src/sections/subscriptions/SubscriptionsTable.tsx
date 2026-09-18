import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";

import { PaginationControls } from "#/components/dashboard/PaginationControls";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { usePaginatedItems } from "#/hooks/usePaginatedItems";
import { getBillingIntervalShortLabel } from "#/lib/billing-interval";
import type { Subscription } from "#/lib/dashboard/types";
import { formatEur } from "#/lib/money";

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
      <div className="rounded-md bg-card px-6 py-10 ring-1 ring-border">
        <h3 className="text-lg font-medium">Nothing recurring yet</h3>
        <p className="mt-1 max-w-prose text-muted-foreground">
          Add rent, subscriptions, salary and savings plans. The overview then
          shows what is left each month.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-border rounded-md bg-card ring-1 ring-border">
        {visibleSubscriptions.map((subscription) => {
          const isIncome = subscription.category?.type === "income";

          return (
            <li
              key={subscription.id}
              className="flex items-center gap-4 px-5 py-3.5"
            >
              <span aria-hidden className="w-6 text-center text-lg">
                {subscription.category?.icon ?? "🧾"}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium">{subscription.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {subscription.category?.name ?? "Uncategorized"}
                </p>
              </div>

              <div className="text-right">
                <p className="amount text-base">
                  {isIncome ? "+" : ""}
                  {formatEur(subscription.price)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getBillingIntervalShortLabel(subscription.billingInterval)}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${subscription.name}`}
                  >
                    <EllipsisIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(subscription)}>
                    <Pencil className="size-3.5" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      const formData = new FormData();
                      formData.set("id", subscription.id.toString());
                      deleteSubscriptionAction(formData);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          );
        })}
      </ul>
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
