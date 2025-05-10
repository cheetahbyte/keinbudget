import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useServices } from "~/api/services/services.provider";
import { Button } from "~/components/lib/button";
import { Input } from "~/components/lib/input";
import { Label } from "~/components/lib/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/lib/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/lib/sheet";
import { DatePicker } from "../DatePicker";

type TransactionType = "incoming" | "outgoing";

export function TransactionCreateSheet() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>();
  const [accountId, setAccountId] = useState<string>();
  const [categoryId, setCategoryId] = useState<string>("");
  const [type, setType] = useState<TransactionType>("incoming");
  const [date, setDate] = useState<Date>(new Date());

  const {
    refetchTransactions,
    transactionsService,
    accounts,
    categories,
    refetchAccounts,
  } = useServices();

  const createTransaction = async () => {
    if (!description || !amount || !accountId) return;

    await transactionsService?.createTransaction(
      type,
      accountId,
      date,
      amount,
      description,
      categoryId
    );

    await refetchTransactions();
    await refetchAccounts();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="w-4 h-4" /> New Transaction
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-md mx-auto px-6">
        <SheetHeader>
          <SheetTitle>Create a new Transaction</SheetTitle>
          <SheetDescription>
            Add a new transaction to one of your accounts.
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Type</Label>
          <Select
            onValueChange={(s) => setType(s as TransactionType)}
            value={type}
          >
            <SelectTrigger className="col-span-3 w-full">
              <SelectValue placeholder="Choose Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="incoming">Incoming</SelectItem>
              <SelectItem value="outgoing">Outgoing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Birthday Cake"
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              placeholder="120"
              className="col-span-3"
              type="number"
              value={amount ?? 0}
              onChange={(e) => setAmount(Number.parseInt(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Account</Label>
            <Select onValueChange={setAccountId} value={accountId}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Choose account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id ?? ""}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Category</Label>
            <Select onValueChange={setCategoryId} value={categoryId}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id ?? ""}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <DatePicker onChange={setDate} value={date} />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={createTransaction}>
              Create Transaction
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
