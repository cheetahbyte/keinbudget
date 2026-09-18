const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});
const count = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("de-DE", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatEur(value: number): string {
  return eur.format(value);
}

export function formatCount(value: number): string {
  return count.format(value);
}

export function formatShare(value: number): string {
  return percent.format(value);
}
