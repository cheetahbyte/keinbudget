export const CATEGORY_TYPES = ["expense", "savings", "income"] as const;

export type CategoryType = (typeof CATEGORY_TYPES)[number];

const LABELS: Record<CategoryType, string> = {
  expense: "Expense",
  savings: "Savings",
  income: "Income",
};

export function getCategoryTypeLabel(type: CategoryType): string {
  return LABELS[type];
}
