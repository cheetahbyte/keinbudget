import { useMemo, useState } from "react";

import { useFormatters } from "#/lib/preferences-context";

export interface BreakdownItem {
  name: string;
  value: number;
  color: string;
  category: string;
  categoryColor: string;
}

interface BreakdownProps {
  items: BreakdownItem[];
  period?: "daily" | "monthly" | "yearly";
  onPeriodChange?: (period: "daily" | "monthly" | "yearly") => void;
}

type BreakdownType = "category" | "subscription";

const VIEWS: ReadonlyArray<{ value: BreakdownType; label: string }> = [
  { value: "subscription", label: "By entry" },
  { value: "category", label: "By category" },
];

export function Breakdown({
  items,
  period = "monthly",
  onPeriodChange,
}: BreakdownProps) {
  const { formatMoney, formatShare } = useFormatters();
  const multiplier =
    period === "daily" ? 12 / 365 : period === "yearly" ? 12 : 1;
  const [breakdownType, setBreakdownType] =
    useState<BreakdownType>("subscription");

  const visibleItems = useMemo(() => {
    if (breakdownType === "subscription") {
      return items;
    }

    return Object.values(
      items.reduce<Record<string, BreakdownItem>>((acc, item) => {
        const existing = acc[item.category];

        if (existing) {
          existing.value += item.value;
          return acc;
        }

        acc[item.category] = {
          name: item.category,
          category: item.category,
          color: item.categoryColor,
          categoryColor: item.categoryColor,
          value: item.value,
        };

        return acc;
      }, {}),
    ).sort((a, b) => b.value - a.value);
  }, [breakdownType, items]);

  const total = visibleItems.reduce((sum, item) => sum + item.value, 0);
  const largest = visibleItems[0]?.value ?? 0;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3">
          <div className="flex gap-4 text-sm">
            {VIEWS.map((view) => (
              <button
                key={view.value}
                type="button"
                aria-pressed={breakdownType === view.value}
                className={`-mb-px cursor-pointer border-b-2 pb-0.5 focus-visible:outline-2 focus-visible:outline-ring ${
                  breakdownType === view.value
                    ? "border-pen text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setBreakdownType(view.value)}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {visibleItems.length}{" "}
          {breakdownType === "subscription" ? "entries" : "categories"},{" "}
          <button
            type="button"
            aria-label={`Breakdown period: ${period}. Switch to ${period === "monthly" ? "daily" : period === "daily" ? "yearly" : "monthly"}`}
            onClick={() =>
              onPeriodChange?.(
                period === "monthly"
                  ? "daily"
                  : period === "daily"
                    ? "yearly"
                    : "monthly",
              )
            }
            className="cursor-pointer rounded-sm border-0 bg-transparent p-0 font-bold text-inherit underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {period}
          </button>
        </p>
      </div>

      {visibleItems.length === 0 ? (
        <p className="text-muted-foreground">
          No expenses yet. Add a recurring entry and it shows up here.
        </p>
      ) : (
        <ol className="flex flex-col divide-y divide-border">
          {visibleItems.map((item) => {
            const share = total > 0 ? item.value / total : 0;
            const width = largest > 0 ? (item.value / largest) * 100 : 0;

            return (
              <li
                key={item.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1.5 py-3 sm:grid-cols-[minmax(7rem,14rem)_minmax(0,1fr)_auto]"
              >
                <span className="truncate text-sm">{item.name}</span>
                <span className="amount text-sm sm:order-last">
                  {formatMoney(item.value * multiplier)}
                  <span className="ml-3 inline-block w-14 text-right text-muted-foreground">
                    {formatShare(share)}
                  </span>
                </span>
                <span className="col-span-2 h-1 w-full sm:col-span-1">
                  <span
                    className="block h-full rounded-xs"
                    style={{
                      width: `${width}%`,
                      backgroundColor: `color-mix(in oklab, ${item.color} 40%, var(--chart-3))`,
                    }}
                  />
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
