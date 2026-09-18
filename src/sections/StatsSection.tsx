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
}: {
  projections: MonthlyProjections;
}) {
  const { income, expenses, savings, remaining } = projections;
  const month = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-muted-foreground">{month}</p>
          <h1 className="mt-1 text-xl font-medium">Left after fixed costs</h1>
          <p
            className={`amount-hero mt-3 text-[clamp(2rem,7vw,3.5rem)] ${
              remaining < 0 ? "text-destructive" : "text-foreground"
            }`}
          >
            <Scritto value={formatEur(remaining)} transition={transition} />
          </p>
        </div>
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
