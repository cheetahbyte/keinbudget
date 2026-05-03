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
        <span className="ml-1 text-base text-muted-foreground">EUR</span>
      </h2>

      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
interface StatSectionProps {
  stats: DashboardStats;
  breakdownStats: BreakdownItem[];
}

export function StatsSection({ stats, breakdownStats }: StatSectionProps) {
  const monthlyCost = getMonthlyCost(stats);
  const yearlyCost = getYearlyCost(stats);
  const { dailyCost } = stats;

  const burgerPrice = 8;
  const coffeePrice = 4;

  const monthlyBurger = monthlyCost / burgerPrice;
  const yearlyBurger = yearlyCost / burgerPrice;
  const dailyCoffee = dailyCost / coffeePrice;

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
            <span className="text-xl text-muted-foreground">EUR</span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            That&apos;s{" "}
            <span className="mr-1 text-primary">
              {monthlyBurger.toFixed(1)} burgers
            </span>
            per month you&apos;re not eating
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SmallCard
            title="Yearly"
            value={yearlyCost.toFixed(2)}
            text={`${yearlyBurger.toFixed(0)} burgers per year`}
          />

          <SmallCard
            title="Daily"
            value={dailyCost.toFixed(2)}
            text={`${dailyCoffee.toFixed(1)} coffees per day`}
          />
        </div>
      </div>

      <Breakdown items={breakdownStats} />
    </div>
  );
}
