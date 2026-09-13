import type { BillingInterval } from "#/lib/billing-interval";
import { toMonthlyPrice } from "#/lib/billing-interval";
import type { CategoryType } from "#/lib/category-type";

export interface ProjectionEntry {
  price: number;
  billingInterval: BillingInterval;
  /** null = uncategorized entry, counted as expense */
  type: CategoryType | null;
}

export function computeMonthlyProjections(entries: ProjectionEntry[]) {
  let income = 0;
  let expenses = 0;
  let savings = 0;

  for (const entry of entries) {
    const monthly = toMonthlyPrice(entry.price, entry.billingInterval);
    const type = entry.type ?? "expense";

    if (type === "income") {
      income += monthly;
    } else if (type === "savings") {
      savings += monthly;
    } else {
      expenses += monthly;
    }
  }

  return {
    income,
    expenses,
    savings,
    remaining: income - expenses - savings,
  };
}
