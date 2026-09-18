import { expect, it } from "vitest";

import {
  getBillingIntervalLabel,
  getBillingIntervalShortLabel,
  isBillingInterval,
  toMonthlyPrice,
} from "#/lib/billing-interval";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "#/schemas/subscription";

it.each([
  ["semiannual", "Semiannual (every 6 months)", "per 6 months", 20],
  ["biennial", "Biennial (every 2 years)", "per 2 years", 5],
] as const)(
  "supports %s entries in creation, editing, labels and monthly costs",
  (interval, label, shortLabel, monthlyPrice) => {
    const entry = {
      name: "Insurance",
      price: 120,
      billingInterval: interval,
      categoryId: null,
    };

    expect(createSubscriptionSchema.parse(entry)).toEqual(entry);
    expect(updateSubscriptionSchema.parse({ ...entry, id: 1 })).toEqual({
      ...entry,
      id: 1,
    });
    expect(isBillingInterval(interval)).toBe(true);
    expect(getBillingIntervalLabel(interval)).toBe(label);
    expect(getBillingIntervalShortLabel(interval)).toBe(shortLabel);
    expect(toMonthlyPrice(120, interval)).toBe(monthlyPrice);
  },
);
