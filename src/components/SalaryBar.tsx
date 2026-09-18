import { formatEur } from "#/lib/money";

interface SalaryBarProps {
  income: number;
  expenses: number;
  savings: number;
  remaining: number;
}

// Income is the sheet; expenses are written in ink, savings in pencil, and
// what is left stays blank paper. Overspend runs past the sheet in red.
export function SalaryBar({
  income,
  expenses,
  savings,
  remaining,
}: SalaryBarProps) {
  const overspent = remaining < 0 ? -remaining : 0;
  const total = Math.max(income, expenses + savings, 1);
  const pct = (value: number) => `${(value / total) * 100}%`;

  const segments = [
    { label: "Expenses", value: expenses, className: "bg-chart-2" },
    { label: "Savings", value: savings, className: "bg-chart-3" },
    {
      label: "Left",
      value: Math.max(remaining, 0),
      className: "bg-card ring-1 ring-inset ring-border",
    },
    { label: "Overspent", value: overspent, className: "bg-destructive" },
  ].filter((segment) => segment.value > 0);

  return (
    <figure className="flex flex-col gap-3">
      <div
        className="flex h-2 w-full overflow-hidden rounded-sm"
        role="img"
        aria-label={segments
          .map((segment) => `${segment.label} ${formatEur(segment.value)}`)
          .join(", ")}
      >
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={segment.className}
            style={{ width: pct(segment.value) }}
          />
        ))}
      </div>
      <figcaption className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {segments.map((segment) => (
          <span key={segment.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className={`size-2.5 rounded-xs ${segment.className}`}
            />
            <span className="text-muted-foreground">{segment.label}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
