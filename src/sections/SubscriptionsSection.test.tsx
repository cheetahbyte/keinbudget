import { describe, expect, it } from "vitest";

import type { Category, Subscription } from "#/lib/dashboard/types";

import { filterSubscriptionsByType } from "./SubscriptionsSection";

function subscription(
  name: string,
  categoryType: Category["type"] | null,
): Subscription {
  return {
    id: 1,
    name,
    price: 10,
    billingInterval: "monthly",
    category: categoryType
      ? { id: 1, name, icon: "☕", type: categoryType }
      : null,
  };
}

const expense = subscription("Netflix", "expense");
const savings = subscription("ETF", "savings");
const income = subscription("Salary", "income");
const uncategorized = subscription("Coffee", null);

describe("filterSubscriptionsByType", () => {
  const all = [expense, savings, income, uncategorized];

  it("returns everything for the all filter", () => {
    expect(filterSubscriptionsByType(all, "all")).toEqual(all);
  });

  it("keeps expense entries and treats uncategorized as expense", () => {
    expect(filterSubscriptionsByType(all, "expense")).toEqual([
      expense,
      uncategorized,
    ]);
  });

  it("keeps only savings entries", () => {
    expect(filterSubscriptionsByType(all, "savings")).toEqual([savings]);
  });

  it("keeps only income entries", () => {
    expect(filterSubscriptionsByType(all, "income")).toEqual([income]);
  });
});
