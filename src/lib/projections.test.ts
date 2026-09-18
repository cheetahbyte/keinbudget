import { describe, expect, it } from "vitest";

import { computeMonthlyProjections } from "#/lib/projections";

describe("computeMonthlyProjections", () => {
  it("returns zeros for no entries", () => {
    expect(computeMonthlyProjections([])).toEqual({
      income: 0,
      expenses: 0,
      savings: 0,
      remaining: 0,
    });
  });

  it("converts mixed billing intervals to monthly amounts", () => {
    const projections = computeMonthlyProjections([
      { price: 12, billingInterval: "monthly", type: "expense" },
      { price: 52, billingInterval: "weekly", type: "expense" },
      { price: 30, billingInterval: "quarterly", type: "expense" },
      { price: 60, billingInterval: "semiannual", type: "expense" },
      { price: 120, billingInterval: "yearly", type: "expense" },
    ]);

    expect(projections.expenses).toBeCloseTo(
      12 + (52 * 52) / 12 + 10 + 10 + 10,
    );
  });

  it("splits income, expenses and savings by entry type", () => {
    const projections = computeMonthlyProjections([
      { price: 100, billingInterval: "monthly", type: "income" },
      { price: 20, billingInterval: "monthly", type: "savings" },
      { price: 30, billingInterval: "monthly", type: "expense" },
    ]);

    expect(projections).toEqual({
      income: 100,
      expenses: 30,
      savings: 20,
      remaining: 50,
    });
  });

  it("counts uncategorized entries as expenses", () => {
    const projections = computeMonthlyProjections([
      { price: 9.99, billingInterval: "monthly", type: null },
    ]);

    expect(projections).toEqual({
      income: 0,
      expenses: 9.99,
      savings: 0,
      remaining: -9.99,
    });
  });

  it("returns negative remaining when expenses exceed income", () => {
    const projections = computeMonthlyProjections([
      { price: 10, billingInterval: "monthly", type: "income" },
      { price: 15, billingInterval: "monthly", type: "expense" },
    ]);

    expect(projections.remaining).toBe(-5);
  });
});
