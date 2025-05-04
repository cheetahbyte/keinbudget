import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useAccountContext } from "~/api/services/accounts.service";
import { Button } from "~/components/lib/button";
import { Input } from "~/components/lib/input";
import { Label } from "~/components/lib/label";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "~/components/lib/sheet";

export function AccountCreateSheet() {
  const [accountName, setAccountName] = useState("");
  const [startBalance, setStartBalance] = useState<number>();
  const {accountsService, refetchAccounts } = useAccountContext()

  const createAccount = async () => {
    await accountsService.createAccount(accountName, startBalance ?? 0);
    refetchAccounts()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="w-4 h-4" /> New Account
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-md mx-auto px-6">
        <SheetHeader>
          <SheetTitle>Create a new Account</SheetTitle>
          <SheetDescription>
            To add your new account, just give it a name and its current
            balance.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Account Name
            </Label>
            <Input
              id="name"
              placeholder="Girokonto ING"
              className="col-span-3"
              value={accountName}
              onChange={(e) => {
                setAccountName(e.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-balance" className="text-right">
              Start Balance
            </Label>
            <Input
              id="start-balance"
              placeholder="120"
              className="col-span-3"
              value={startBalance}
              onChange={(e) => {
                setStartBalance(parseInt(e.target.value));
              }}
              type="number"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" className="cursor-pointer" onClick={createAccount}>
              Create Account
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
