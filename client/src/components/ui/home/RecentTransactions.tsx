import type dynamicIconImports from "lucide-react/dynamicIconImports";
import { useEffect, useState } from "react";
import { useServices } from "~/api/services/services.provider";
import type { Transaction } from "~/api/types/transaction";
import { DynamicIcon } from "~/components/common/DynamicIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/lib/card";

export default function RecentTransactions() {
  const { transactionsService } = useServices();
  const [lastTransactions, setLastTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionsService?.getLastTransactions().then((res) => {
      setLastTransactions(res);
      setLoading(false);
    });
  }, [transactionsService]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : lastTransactions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No recent transactions found.
            </p>
          ) : (
            lastTransactions.map((tx) => {
              return (
                <li key={tx.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {tx.category ? (
                        <DynamicIcon
                          name={
                            tx.category.icon as keyof typeof dynamicIconImports
                          }
                          className="w-5 h-5 text-muted-foreground"
                        />
                      ) : (
                        <DynamicIcon
                          className="w-5 h-5 text-muted-foreground"
                          name="shopping-basket"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium leading-none">
                        {tx.description || "Unnamed"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tx.category ? tx.category.name : "no category"} ·{" "}
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      !tx.toAccount && tx.fromAccount
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {!tx.toAccount && tx.fromAccount ? "-" : "+"}
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }).format(tx.amount)}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
