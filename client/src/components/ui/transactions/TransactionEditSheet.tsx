import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
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
import { Transaction } from "~/api/types/transaction";

type TransactionType = "incoming" | "outgoing";

interface TransactionEditSheetProps {
  transaction: Transaction
}

export function TransactionEditSheet({ transaction }: TransactionEditSheetProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>();
  const [accountId, setAccountId] = useState<string>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [type, setType] = useState<TransactionType>("incoming");
  const [date, setDate] = useState<Date>(new Date());

  const {
    refetchTransactions,
    transactionsService,
    accounts,
    categories,
    refetchAccounts,
  } = useServices();

  useEffect(() => {
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setAccountId(transaction.id);
    setCategoryId(transaction.category?.id ?? "empty");
    setAccountId(transaction.fromAccount ?? transaction.toAccount);
    setDate(new Date(transaction.createdAt));
  }, [transaction]);

  const editTransaction = async () => {
    if (!description || !amount || !accountId) return;

    await transactionsService?.editTransaction(transaction.id, {
      description,
      amount,
      created_at: date,
      category: categoryId,
      ...(type === "incoming"
        ? { to_account: accountId }
        : { from_account: accountId }),
    });

    await refetchTransactions();
    await refetchAccounts();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-md mx-auto px-6">
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>Modify the details of this transaction.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Type</Label>
            <Select onValueChange={(s) => setType(s as TransactionType)} value={type}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description</Label>
            <Input
              value={description}
              className="col-span-3"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Amount</Label>
            <Input
              type="number"
              className="col-span-3"
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
                <SelectItem value="empty">no category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <DatePicker value={date} onChange={setDate} />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={editTransaction}>Save Changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}