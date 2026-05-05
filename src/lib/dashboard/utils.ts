import type { BreakdownItem } from "#/components/Breakdown";
import { toMonthlyPrice } from "#/lib/billing-interval";
import type { DashboardStats, Subscription } from "#/lib/dashboard/types";

const BREAKDOWN_PALETTE = [
  "#c96b2c",
  "#9a7a17",
  "#2f8f63",
  "#227c9d",
  "#2f63c7",
  "#6f4ccf",
  "#9a4fd1",
  "#c24f8a",
  "#c55a4f",
  "#8f5e3b",
  "#4f7d34",
  "#3c6f78",
] as const;

function assignPalette<T>(
  values: T[],
  getKey: (value: T) => string | number,
): Map<string, string> {
  const uniqueKeys = [
    ...new Set(values.map((value) => String(getKey(value)))),
  ].sort((left, right) => left.localeCompare(right));

  return new Map(
    uniqueKeys.map((key, index) => [
      key,
      BREAKDOWN_PALETTE[index % BREAKDOWN_PALETTE.length],
    ]),
  );
}

export function buildBreakdownItems(
  subscriptions: Subscription[],
): BreakdownItem[] {
  const subscriptionColors = assignPalette(
    subscriptions,
    (subscription) => subscription.id,
  );
  const categoryColors = assignPalette(
    subscriptions.map(
      (subscription) => subscription.category?.name ?? "Uncategorized",
    ),
    (categoryName) => categoryName,
  );

  return subscriptions
    .map((subscription) => {
      const categoryName = subscription.category?.name ?? "Uncategorized";

      return {
        name: subscription.name,
        category: categoryName,
        color:
          subscriptionColors.get(String(subscription.id)) ??
          BREAKDOWN_PALETTE[0],
        categoryColor: categoryColors.get(categoryName) ?? BREAKDOWN_PALETTE[1],
        value: toMonthlyPrice(subscription.price, subscription.billingInterval),
      };
    })
    .sort((left, right) => right.value - left.value);
}

export function getMonthlyCost(stats: DashboardStats): number {
  return stats.dailyCost * 30;
}

export function getYearlyCost(stats: DashboardStats): number {
  return stats.dailyCost * 365;
}
