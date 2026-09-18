import Scritto from "@scritto/react";
import { Link } from "@tanstack/react-router";

import { SalaryBar } from "#/components/SalaryBar";
import type { MonthlyProjections } from "#/lib/dashboard/types";
import { formatEur } from "#/lib/money";

const transition = { duration: 300, easing: "ease-out" };

function LedgerRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <span aria-hidden className="leader" />
      <dd className={`amount text-base ${value < 0 ? "text-destructive" : ""}`}>
        <Scritto value={formatEur(value)} transition={transition} />
      </dd>
    </div>
  );
}

export function StatsSection({
  projections,
  period = "monthly",
}: {
  projections: MonthlyProjections;
  period?: "daily" | "monthly" | "yearly";
}) {
  const multiplier =
    period === "daily" ? 12 / 365 : period === "yearly" ? 12 : 1;
  const income = projections.income * multiplier;
  const expenses = projections.expenses * multiplier;
  const savings = projections.savings * multiplier;
  const remaining = projections.remaining * multiplier;
  const month = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {period === "monthly"
              ? month
              : period === "daily"
                ? "Daily average"
                : "Yearly projection"}
          </p>
          <h1 className="mt-1 text-xl font-medium">Left after fixed costs</h1>
          <p
            className={`amount-hero mt-3 text-[clamp(2rem,7vw,3.5rem)] ${
              remaining < 0 ? "text-destructive" : "text-foreground"
            }`}
          >
            <Scritto value={formatEur(remaining)} transition={transition} />
          </p>
        </div>
        <nav aria-label="Projection period" className="flex gap-4 text-sm">
          {(["daily", "monthly", "yearly"] as const).map((option) => (
            <Link
              key={option}
              to="/"
              search={{ period: option }}
              aria-current={period === option ? "page" : undefined}
              className="rounded-sm capitalize text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:text-foreground aria-[current=page]:underline"
            >
              {option}
            </Link>
          ))}
        </nav>
        <SalaryBar
          income={income}
          expenses={expenses}
          savings={savings}
          remaining={remaining}
        />
      </section>

      <div className="flex w-full max-w-md flex-col gap-6">
        <dl className="flex flex-col divide-y divide-border">
          <LedgerRow label="Income" value={income} />
          <LedgerRow label="Expenses" value={expenses} />
          <LedgerRow label="Savings" value={savings} />
        </dl>
        <Link
          to="/breakdown"
          className="w-fit text-sm text-pen underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
        >
          View breakdown
        </Link>
      </div>
    </div>
  );
}
