import { useMemo, useState } from "react";

export interface BreakdownItem {
  name: string;
  value: number;
  color: string;
  category: string;
  categoryColor: string;
}

interface BreakdownProps {
  items: BreakdownItem[];
}

export function Breakdown({ items }: BreakdownProps) {
  const [breakdownType, setBreakdownType] = useState<
    "category" | "subscription"
  >("subscription");

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

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Breakdown
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              className={
                breakdownType === "subscription"
                  ? "cursor-pointer font-medium text-foreground underline"
                  : "cursor-pointer text-muted-foreground hover:text-foreground"
              }
              onClick={() => setBreakdownType("subscription")}
            >
              By Subscription
            </button>
            <button
              type="button"
              className={
                breakdownType === "category"
                  ? "cursor-pointer font-medium text-foreground underline"
                  : "cursor-pointer text-muted-foreground hover:text-foreground"
              }
              onClick={() => setBreakdownType("category")}
            >
              By Category
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {visibleItems.length}{" "}
          {breakdownType === "subscription" ? "subscriptions" : "categories"}
        </p>
      </div>

      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {visibleItems.map((item) => (
          <div
            key={item.name}
            className="h-full"
            style={{
              width: `${(item.value / total) * 100}%`,
              backgroundColor: item.color,
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {visibleItems.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm" style={{ color: item.color }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
