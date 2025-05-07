import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "~/components/lib/drawer";
import { Button } from "~/components/lib/button";
import { Eye } from "lucide-react";
import type { Account } from "~/api/types/account";
import { useEffect, useState } from "react";
import { Transaction } from "~/api/types/transaction";
import { useTransactionContext } from "~/api/services/transactions.service";
import AccountGraph from "./AccountGraph";

interface AccountDetailsDrawerProps {
  account: Account;
}

export function AccountDetailsDrawer({ account }: AccountDetailsDrawerProps) {
  const { transactionService } = useTransactionContext();
  const [accountTransactions, setAccountTransactions] = useState<Transaction[]>(
    []
  );

  useEffect(() => {
    transactionService
      .getTransactionsForAccount(account.id)
      .then(setAccountTransactions);
  }, [transactionService, account.id]);

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
              <p className="font-medium text-foreground">
                Current Balance
              </p>
              <p>{account.currentBalance.toFixed(2)}€</p>
            </div>
          </div>

          <div className="border-t pt-4">
            {accountTransactions.length > 0 ? (
              <AccountGraph
                transactions={accountTransactions}
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
