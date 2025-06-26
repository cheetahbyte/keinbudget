import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import type { Account } from "~/api/types/account";
import type { Transaction } from "~/api/types/transaction";
import { Button } from "~/components/lib/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/lib/drawer";
import AccountGraph from "./AccountGraph";
import useTransactionsActions from "~/api/hooks/useTransactionActions";

interface AccountDetailsDrawerProps {
  account: Account;
}

export function AccountDetailsDrawer({ account }: AccountDetailsDrawerProps) {
  const { getTransactionsForAccount } = useTransactionsActions();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactionsForAccount(account.id).then(setTransactions);
  }, [account.id, getTransactionsForAccount]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="w-4 h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{account.name}</DrawerTitle>
          <DrawerDescription>Account details</DrawerDescription>
        </DrawerHeader>
        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Account name</p>
              <p>{account.name}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Initial Balance</p>
              <p>{account.startBalance.toFixed(2)}€</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Current Balance</p>
              <p>{account.currentBalance.toFixed(2)}€</p>
            </div>
          </div>

          <div className="border-t pt-4">
            {transactions.length > 0 ? (
              <AccountGraph
                transactions={transactions}
                accountId={account.id}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                No transactions yet.
              </p>
            )}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
