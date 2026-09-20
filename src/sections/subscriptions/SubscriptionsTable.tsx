import {
  EllipsisIcon,
  Pencil,
  PlayIcon,
  PauseIcon,
  Trash2,
} from "lucide-react";

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
import { useFormatters } from "#/lib/preferences-context";
import { daysUntil, formatRelativeDays, todayIso } from "#/lib/renewals";

interface SubscriptionsTableProps {
  deleteSubscriptionAction: (formData: FormData) => Promise<void>;
  onEdit: (subscription: Subscription) => void;
  onToggleActive: (subscription: Subscription) => void;
  subscriptions: Subscription[];
}

export function SubscriptionsTable({
  deleteSubscriptionAction,
  onEdit,
  onToggleActive,
  subscriptions,
}: SubscriptionsTableProps) {
  const { formatMoney, formatDate } = useFormatters();
  const today = todayIso();
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
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium">Nothing recurring yet</h3>
        <p className="max-w-prose text-muted-foreground">
          Add rent, subscriptions, salary and savings plans. The overview then
          shows what is left each month.
        </p>
      </div>
    );
  }

  return (
    <div id="subscriptions" className="flex flex-col gap-6">
      <ul className="divide-y divide-border">
        {visibleSubscriptions.map((subscription) => {
          const isIncome = subscription.category?.type === "income";
          const previousPrice = subscription.priceHistory[1]?.price;
          const details = [subscription.category?.name ?? "Uncategorized"];
          if (!subscription.isActive) details.push("Paused");
          else if (subscription.nextBillingDate) {
            const days = daysUntil(subscription.nextBillingDate, today);
            details.push(
              `Renews ${formatRelativeDays(days)} (${formatDate(subscription.nextBillingDate)})`,
            );
          }

          return (
            <li
              key={subscription.id}
              className={`flex items-center gap-3 py-3 sm:gap-6 ${
                subscription.isActive ? "" : "opacity-60"
              }`}
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm">
                  {subscription.name}
                  {subscription.notes && (
                    <span
                      title={subscription.notes}
                      className="ml-2 text-xs text-muted-foreground"
                    >
                      note
                    </span>
                  )}
                </h3>
                <p className="truncate text-sm text-muted-foreground">
                  {details.join(" · ")}
                </p>
              </div>

              <div className="text-right">
                <p
                  className="amount text-sm"
                  title={
                    previousPrice === undefined
                      ? undefined
                      : `Previously ${formatMoney(previousPrice)}`
                  }
                >
                  {isIncome ? "+" : ""}
                  {formatMoney(subscription.price)}
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
                    onClick={() => onToggleActive(subscription)}
                  >
                    {subscription.isActive ? (
                      <PauseIcon className="size-3.5" />
                    ) : (
                      <PlayIcon className="size-3.5" />
                    )}
                    {subscription.isActive ? "Pause" : "Resume"}
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
