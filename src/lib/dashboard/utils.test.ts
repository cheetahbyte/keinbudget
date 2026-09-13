import { describe, expect, it } from "vitest";

import type { Subscription } from "#/lib/dashboard/types";
import { buildBreakdownItems } from "#/lib/dashboard/utils";

function subscription(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: 1,
    name: "Subscription",
    price: 10,
    billingInterval: "monthly",
    category: { id: 1, name: "Category", icon: "icon", type: "expense" },
    ...overrides,
  };
}

describe("buildBreakdownItems", () => {
  it("keeps only expense entries; uncategorized counts as expense", () => {
    const items = buildBreakdownItems([
      subscription({
        id: 1,
        name: "Netflix",
        category: { id: 1, name: "Streaming", icon: "tv", type: "expense" },
      }),
      subscription({
        id: 2,
        name: "Stocks",
        category: { id: 2, name: "Invest", icon: "chart", type: "income" },
      }),
      subscription({
        id: 3,
        name: "Savings Plan",
        category: { id: 3, name: "Save", icon: "pig", type: "savings" },
      }),
      subscription({ id: 4, name: "Uncategorized Sub", category: null }),
    ]);

    expect(items.map((item) => item.name)).toEqual([
      "Netflix",
      "Uncategorized Sub",
    ]);
    expect(items.map((item) => item.category)).toEqual([
      "Streaming",
      "Uncategorized",
    ]);
  });

  it("sorts items by monthly value descending", () => {
    const items = buildBreakdownItems([
      subscription({
        id: 1,
        name: "Cheap",
        price: 1,
        category: { id: 1, name: "Cat", icon: "icon", type: "expense" },
      }),
      subscription({
        id: 2,
        name: "Yearly",
        price: 120,
        billingInterval: "yearly",
        category: { id: 1, name: "Cat", icon: "icon", type: "expense" },
      }),
      subscription({
        id: 3,
        name: "Weekly",
        price: 10,
        billingInterval: "weekly",
        category: { id: 2, name: "Cat", icon: "icon", type: "expense" },
      }),
    ]);

    expect(items.map((item) => item.name)).toEqual([
      "Weekly",
      "Yearly",
      "Cheap",
    ]);
  });
});
