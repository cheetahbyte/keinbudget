import { useEffect, useState } from "react";
import { useServices } from "~/api/services/services.provider";
import type { FinanceOverview as FO } from "~/api/types/finance";
import { Card, CardContent } from "~/components/lib/card";

export default function FinanceOverview() {
  const { financeService } = useServices();
  const [overview, setOverview] = useState<FO | undefined>(undefined);
  useEffect(() => {
    financeService?.getOverview().then(setOverview);
  }, [financeService]);

  const dynamicData = overview
    ? [
        {
          title: "Total Balance",
          amount: `${overview.totalBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            currency: "EUR",
            style: "currency",
          })}`,
          change: "NaN",
          positive: overview.totalBalance >= 0,
        },
        {
          title: "Income",
          amount: `${overview.income.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            currency: "EUR",
            style: "currency",
          })}`,
          change: "NaN",
          positive: overview.income >= 0,
        },
        {
          title: "Expenses",
          amount: `${overview.expenses.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            currency: "EUR",
            style: "currency",
          })}`,
          change: "NaN",
          positive: false,
        },
        {
          title: "Savings",
          amount: `${overview.savings.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            currency: "EUR",
            style: "currency",
          })}`,
          change: "NaN",
          positive: overview.savings >= 0,
        },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {dynamicData.map((item) => (
        <Card key={item.title} className="w-full rounded-2xl shadow-md">
          <CardContent className="px-6 py-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-muted-foreground">
                {item.title}
              </h3>
              {/** 
              {item.positive ? (
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              )}
                */}
            </div>

            <div className="text-3xl font-bold mb-2">{item.amount}</div>
            {/**
            <p
              className={`text-sm ${
                item.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              This month {item.change}
            </p>
             */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
