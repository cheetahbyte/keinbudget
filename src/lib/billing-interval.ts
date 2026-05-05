export const BILLING_INTERVALS = [
  "monthly",
  "weekly",
  "quarterly",
  "yearly",
] as const;

export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export function isBillingInterval(value: string): value is BillingInterval {
  return BILLING_INTERVALS.includes(value as BillingInterval);
}

const LABELS: Record<BillingInterval, string> = {
  monthly: "Monthly",
  weekly: "Weekly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

const SHORT_LABELS: Record<BillingInterval, string> = {
  monthly: "per month",
  weekly: "per week",
  quarterly: "per quarter",
  yearly: "per year",
};

export function getBillingIntervalLabel(interval: BillingInterval): string {
  return LABELS[interval];
}

export function getBillingIntervalShortLabel(
  interval: BillingInterval,
): string {
  return SHORT_LABELS[interval];
}

export function toMonthlyPrice(
  price: number,
  billingInterval: BillingInterval,
): number {
  switch (billingInterval) {
    case "weekly":
      return (price * 52) / 12;
    case "quarterly":
      return price / 3;
    case "yearly":
      return price / 12;
    default:
      return price;
  }
}
