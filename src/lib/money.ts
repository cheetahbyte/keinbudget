import type { Preferences } from "#/lib/locale";
import { DEFAULT_PREFERENCES } from "#/lib/locale";

export interface Formatters {
  formatMoney: (value: number) => string;
  formatCount: (value: number) => string;
  formatShare: (value: number) => string;
  formatDate: (isoDate: string) => string;
}

const cache = new Map<string, Formatters>();

export function createFormatters(
  preferences: Preferences = DEFAULT_PREFERENCES,
): Formatters {
  const key = `${preferences.locale}/${preferences.currency}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const money = new Intl.NumberFormat(preferences.locale, {
    style: "currency",
    currency: preferences.currency,
  });
  const count = new Intl.NumberFormat(preferences.locale, {
    maximumFractionDigits: 0,
  });
  const percent = new Intl.NumberFormat(preferences.locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const date = new Intl.DateTimeFormat(preferences.locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  });

  const formatters: Formatters = {
    formatMoney: (value) => money.format(value),
    formatCount: (value) => count.format(value),
    formatShare: (value) => percent.format(value),
    formatDate: (isoDate) => date.format(new Date(`${isoDate}T00:00:00Z`)),
  };
  cache.set(key, formatters);
  return formatters;
}

const defaults = createFormatters();

export const formatEur = defaults.formatMoney;
export const formatCount = defaults.formatCount;
export const formatShare = defaults.formatShare;
