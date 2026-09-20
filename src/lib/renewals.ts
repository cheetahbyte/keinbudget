import type { BillingInterval } from "#/lib/billing-interval";

const MONTHS: Partial<Record<BillingInterval, number>> = {
  monthly: 1,
  quarterly: 3,
  semiannual: 6,
  yearly: 12,
  biennial: 24,
};

const DAY_MS = 86_400_000;

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayIso(now: Date = new Date()): string {
  return toIsoDate(now);
}

function parse(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

// Occurrences are computed from the anchor, not iteratively, so a Jan 31
// anchor yields Feb 28, Mar 31, ... instead of drifting to the 28th forever.
export function nthOccurrence(
  anchorIso: string,
  interval: BillingInterval,
  n: number,
): string {
  const anchor = parse(anchorIso);
  if (interval === "weekly") {
    return toIsoDate(new Date(anchor.getTime() + n * 7 * DAY_MS));
  }
  const months = MONTHS[interval] ?? 1;
  const totalMonths = anchor.getUTCMonth() + months * n;
  const year = anchor.getUTCFullYear() + Math.floor(totalMonths / 12);
  const month = ((totalMonths % 12) + 12) % 12;
  const day = Math.min(anchor.getUTCDate(), daysInMonth(year, month));
  return toIsoDate(new Date(Date.UTC(year, month, day)));
}

export function nextOccurrence(
  anchorIso: string,
  interval: BillingInterval,
  today: string,
): string {
  if (anchorIso >= today) return anchorIso;
  const elapsedDays =
    (parse(today).getTime() - parse(anchorIso).getTime()) / DAY_MS;
  // Upper bound on period length gives a lower bound on n; the loop finishes
  const periodDays = interval === "weekly" ? 7 : (MONTHS[interval] ?? 1) * 31;
  let n = Math.floor(elapsedDays / periodDays);
  let candidate = nthOccurrence(anchorIso, interval, n);
  while (candidate < today) {
    n += 1;
    candidate = nthOccurrence(anchorIso, interval, n);
  }
  return candidate;
}

export function daysUntil(isoDate: string, today: string): number {
  return Math.round(
    (parse(isoDate).getTime() - parse(today).getTime()) / DAY_MS,
  );
}

export interface RenewalSource {
  id: number;
  name: string;
  price: number;
  billingInterval: BillingInterval;
  isActive: boolean;
  nextBillingDate: string | null;
}

export interface Renewal<T extends RenewalSource = RenewalSource> {
  entry: T;
  date: string;
  daysUntil: number;
}

export function buildUpcomingRenewals<T extends RenewalSource>(
  entries: T[],
  today: string,
  withinDays = 30,
): Renewal<T>[] {
  const renewals: Renewal<T>[] = [];
  for (const entry of entries) {
    if (!entry.isActive || entry.nextBillingDate === null) continue;
    const date = nextOccurrence(
      entry.nextBillingDate,
      entry.billingInterval,
      today,
    );
    const days = daysUntil(date, today);
    if (days > withinDays) continue;
    renewals.push({ entry, date, daysUntil: days });
  }
  return renewals.sort(
    (left, right) =>
      left.daysUntil - right.daysUntil ||
      left.entry.name.localeCompare(right.entry.name),
  );
}

export function formatRelativeDays(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
}
