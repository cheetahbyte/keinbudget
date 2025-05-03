// components/FinanceOverview.tsx
import { Card, CardContent } from "~/components/lib/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useFinance } from "~/api/services/finance.service";
import { useEffect, useState } from "react";
import type { FinanceOverview } from "~/api/types/finance";

const data = [
  {
    title: "Total Balance",
    amount: "$5,240.00",
    change: "+4.5%",
    positive: true,
  },
  {
    title: "Income",
    amount: "$2,150.00",
    change: "+2.1%",
    positive: true,
  },
  {
    title: "Expenses",
    amount: "$1,890.00",
    change: "-3.2%",
    positive: false,
  },
  {
    title: "Savings",
    amount: "$960.00",
    change: "+8.2%",
    positive: true,
  },
];

export default function FinanceOverview() {
  const finance = useFinance();
  const [overview, setOverview] = useState<FinanceOverview | undefined>(
    undefined
  );
  useEffect(() => {
    finance.getOverview().then(setOverview);
  }, [finance]);

  const dynamicData = overview
    ? [
        {
          title: "Total Balance",
          amount: `$${overview.totalBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`,
          change: "+4.5%",
          positive: overview.totalBalance >= 0,
        },
        {
          title: "Income",
          amount: `$${overview.income.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`,
          change: "+2.1%",
          positive: overview.income >= 0,
        },
        {
          title: "Expenses",
          amount: `$${overview.expenses.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`,
          change: "-3.2%",
          positive: false,
        },
        {
          title: "Savings",
          amount: `$${overview.savings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`,
          change: "+8.2%",
          positive: overview.savings >= 0,
        },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {(overview ? dynamicData : data).map((item) => (
        <Card key={item.title} className="w-full rounded-2xl shadow-md">
          <CardContent className="px-6 py-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-muted-foreground">
                {item.title}
              </h3>
              {item.positive ? (
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="text-3xl font-bold mb-2">{item.amount}</div>
            <p
              className={`text-sm ${
                item.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              This month {item.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
