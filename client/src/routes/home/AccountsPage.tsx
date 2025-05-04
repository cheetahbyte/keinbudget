import { useEffect, useState } from "react";
import { useAccountsService } from "~/api/services/accounts.service";
import { Button } from "~/components/lib/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/lib/table";
import { PlusCircle, Trash2 } from "lucide-react";
import { Account } from "~/api/types/account";
import { AccountDetailsDrawer } from "~/components/ui/accounts/AccountDrawer";


export default function AccountsPage() {
  const accountsService = useAccountsService();
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    accountsService.getAccounts().then(setAccounts);
  }, [accountsService]);

  const handleAddAccount = () => {
    // TODO
  };

  const handleDelete = (id: string) => {
    // TODO
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Verwalte deine verknüpften Konten
          </p>
        </div>
        <Button onClick={handleAddAccount} className="gap-2">
          <PlusCircle className="w-4 h-4" /> Neuer Account
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell className="text-right">
                    ${account.currentBalance.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <AccountDetailsDrawer account={account}/>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(account.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  Keine Accounts gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
