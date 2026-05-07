import { Breakdown, type BreakdownItem } from "#/components/Breakdown";
import type { DashboardStats } from "#/lib/dashboard/types";
import { getMonthlyCost, getYearlyCost } from "#/lib/dashboard/utils";

interface SmallCardProps {
  title: string;
  value: string;
  text: string;
}

function SmallCard({ title, value, text }: SmallCardProps) {
  return (
    <div className="hidden min-h-36 flex-col justify-center rounded-xl border border-border bg-card/50 p-7 lg:flex">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>

      <h2 className="mt-3 font-mono text-3xl tracking-tight text-foreground">
        {value}
      </h2>

      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface StatSectionProps {
  stats: DashboardStats;
  breakdownStats: BreakdownItem[];
  currency: string;
  comparisonItem: { name: string; price: number };
}

export function StatsSection({
  stats,
  breakdownStats,
  currency,
  comparisonItem,
}: StatSectionProps) {
  const monthlyCost = getMonthlyCost(stats);
  const yearlyCost = getYearlyCost(stats);
  const { dailyCost } = stats;

  const monthlyCount = monthlyCost / comparisonItem.price;
  const yearlyCount = yearlyCost / comparisonItem.price;
  const dailyCount = dailyCost / comparisonItem.price;

  const monthlyFixed = monthlyCost.toFixed(2);
  const [monthlyEuros, monthlyCents] = monthlyFixed.split(".");

  return (
    <div className="flex flex-col gap-8">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly Spending
          </p>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-7xl font-light tracking-tight text-foreground">
              {monthlyEuros}
            </span>
            <span className="font-mono text-3xl text-muted-foreground">
              .{monthlyCents}
            </span>
            <span className="text-xl text-muted-foreground">{currency}</span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            That&apos;s{" "}
            <span className="mr-1 text-primary">
              {monthlyCount.toFixed(1)} {comparisonItem.name}s
            </span>
            per month you&apos;re not eating
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SmallCard
            title="Yearly"
            value={formatCurrency(yearlyCost, currency)}
            text={`${yearlyCount.toFixed(0)} ${comparisonItem.name}s per year`}
          />

          <SmallCard
            title="Daily"
            value={formatCurrency(dailyCost, currency)}
            text={`${dailyCount.toFixed(1)} ${comparisonItem.name}s per day`}
          />
        </div>
      </div>

      <Breakdown items={breakdownStats} />
    </div>
  );
}
