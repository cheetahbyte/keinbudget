"use client";

import { Shapes, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = {
  id: number;
  name: string;
  icon: string;
};

type Subscription = {
  id: number;
  name: string;
  price: number;
  billingInterval: "monthly" | "weekly" | "yearly";
  category: Category | null;
};

interface SubscriptionsTableProps {
  deleteSubscriptionAction: (formData: FormData) => Promise<void>;
  subscriptions: Subscription[];
}

type PageSizes = 5 | 10 | 20;
const PAGE_SIZE_OPTIONS: PageSizes[] = [5, 10, 20];

function intervalLabel(billingInterval: Subscription["billingInterval"]) {
  if (billingInterval === "weekly") return "per week";
  if (billingInterval === "yearly") return "per year";
  return "per month";
}

function getPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}

export function SubscriptionsTable({
  deleteSubscriptionAction,
  subscriptions,
}: SubscriptionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizes>(5);
  const totalPages = Math.max(1, Math.ceil(subscriptions.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const startIndex = (currentPage - 1) * pageSize;
  const visibleSubscriptions = subscriptions.slice(
    startIndex,
    startIndex + pageSize,
  );
  const pageItems = getPageItems(currentPage, totalPages);
  let ellipsisCount = 0;

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
                  {intervalLabel(subscription.billingInterval)}
                </p>
              </div>

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Field orientation="horizontal" className="w-fit gap-3">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value) as PageSizes);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        {totalPages > 1 ? (
          <Pagination className="mx-0 w-auto sm:ml-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#subscriptions"
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                />
              </PaginationItem>

              {pageItems.map((item) => {
                const key =
                  item === "ellipsis"
                    ? `ellipsis-${++ellipsisCount}`
                    : `page-${item}`;

                return (
                  <PaginationItem key={key}>
                    {item === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#subscriptions"
                        isActive={item === currentPage}
                        onClick={(event) => {
                          event.preventDefault();
                          setCurrentPage(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#subscriptions"
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}
