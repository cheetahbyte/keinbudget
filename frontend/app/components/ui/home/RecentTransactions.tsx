import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/lib/card";
import { ShoppingBasketIcon } from "lucide-react"; // Dummy Icon
import { useTransactionService } from "~/api/services/transactions.service";
import { useEffect, useState } from "react";
import type { Transaction } from "~/api/types/transaction";

export default function RecentTransactions() {
  const transactionService = useTransactionService();
  const [lastTransactions, setLastTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionService.getLastTransactions().then((res) => {
      setLastTransactions(res);
      setLoading(false);
    });
  }, [transactionService]);
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
                      <ShoppingBasketIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium leading-none">
                        {tx.description || "Unnamed"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {"Uncategorized"} ·{" "}
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
                    {!tx.toAccount && tx.fromAccount ? "-" : "+"}$
                    {tx.amount.toFixed(2)}
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
