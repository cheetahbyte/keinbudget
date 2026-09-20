export const DEFAULT_LOCALE = "de-DE";
export const DEFAULT_CURRENCY = "EUR";

export const LOCALES = [
  { value: "de-DE", label: "Deutsch (Deutschland)" },
  { value: "de-AT", label: "Deutsch (Österreich)" },
  { value: "de-CH", label: "Deutsch (Schweiz)" },
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-IE", label: "English (Ireland)" },
  { value: "fr-FR", label: "Français" },
  { value: "es-ES", label: "Español" },
  { value: "it-IT", label: "Italiano" },
  { value: "nl-NL", label: "Nederlands" },
  { value: "pl-PL", label: "Polski" },
  { value: "sv-SE", label: "Svenska" },
] as const;

export const CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "CHF",
  "SEK",
  "NOK",
  "DKK",
  "PLN",
  "CZK",
  "JPY",
  "CAD",
  "AUD",
] as const;

export type Locale = (typeof LOCALES)[number]["value"];
export type Currency = (typeof CURRENCIES)[number];

export interface Preferences {
  locale: Locale;
  currency: Currency;
}

export const DEFAULT_PREFERENCES: Preferences = {
  locale: DEFAULT_LOCALE,
  currency: DEFAULT_CURRENCY,
};

export function isLocale(value: string): value is Locale {
  return LOCALES.some((locale) => locale.value === value);
}

export function isCurrency(value: string): value is Currency {
  return CURRENCIES.includes(value as Currency);
}
