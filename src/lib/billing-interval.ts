export const BILLING_INTERVALS = [
  "monthly",
  "weekly",
  "quarterly",
  "semiannual",
  "yearly",
  "biennial",
] as const;

export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export function isBillingInterval(value: string): value is BillingInterval {
  return BILLING_INTERVALS.includes(value as BillingInterval);
}

const LABELS: Record<BillingInterval, string> = {
  monthly: "Monthly",
  weekly: "Weekly",
  quarterly: "Quarterly",
  semiannual: "Semiannual (every 6 months)",
  yearly: "Yearly",
  biennial: "Biennial (every 2 years)",
};

const SHORT_LABELS: Record<BillingInterval, string> = {
  monthly: "per month",
  weekly: "per week",
  quarterly: "per quarter",
  semiannual: "per 6 months",
  yearly: "per year",
  biennial: "per 2 years",
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
    case "semiannual":
      return price / 6;
    case "yearly":
      return price / 12;
    case "biennial":
      return price / 24;
    default:
      return price;
  }
}
