import { Breakdown, type BreakdownItem } from "#/components/Breakdown";
import type { MonthlyProjections } from "#/lib/dashboard/types";

interface ValueCardProps {
  title: string;
  value: number;
  text?: string;
}

function ValueCard({ title, value, text }: ValueCardProps) {
  const isNegative = value < 0;

  return (
    <div className="flex min-h-36 flex-col justify-center rounded-xl border border-border bg-card/50 p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>

      <h2
        className={`mt-3 font-mono text-3xl tracking-tight ${
          isNegative ? "text-destructive" : "text-foreground"
        }`}
      >
        {value.toFixed(2)}
        <span className="ml-1 text-base text-muted-foreground">EUR</span>
      </h2>

      {text && <p className="mt-3 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

interface StatSectionProps {
  projections: MonthlyProjections;
  breakdownStats: BreakdownItem[];
}

export function StatsSection({
  projections,
  breakdownStats,
}: StatSectionProps) {
  const { income, expenses, savings, remaining } = projections;

  const yearlyExpenses = expenses * 12;
  const dailyExpenses = yearlyExpenses / 365;

  const yearlyBurger = yearlyExpenses / 8;
  const dailyCoffee = dailyExpenses / 4;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Monthly projections
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ValueCard title="Income" value={income} text="from income entries" />
          <ValueCard
            title="Expenses"
            value={expenses}
            text="from expense entries"
          />
          <ValueCard
            title="Savings"
            value={savings}
            text="from savings entries"
          />
          <ValueCard
            title="Remaining"
            value={remaining}
            text="income minus expenses and savings"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ValueCard
          title="Yearly expenses"
          value={yearlyExpenses}
          text={`${yearlyBurger.toFixed(0)} burgers per year`}
        />
        <ValueCard
          title="Daily expenses"
          value={dailyExpenses}
          text={`${dailyCoffee.toFixed(1)} coffees per day`}
        />
      </div>

      <Breakdown items={breakdownStats} />
    </div>
  );
}
