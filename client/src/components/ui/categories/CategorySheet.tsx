import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useServices } from "~/api/services/services.provider";
import { Button } from "~/components/lib/button";
import { Input } from "~/components/lib/input";
import { Label } from "~/components/lib/label";
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
import { IconPicker } from "./IconPicker";

export function TransactionCreateSheet() {
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const [icon, setIcon] = useState("shopping-basket");

  const { categoryService, refetchCategories } = useServices();

  const create = async () => {
    if (!desc || !name) return;

    await categoryService?.createCategory(name, desc, icon);

    await refetchCategories();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="w-4 h-4" /> New Category
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-md mx-auto px-6">
        <SheetHeader>
          <SheetTitle>Create a new Category</SheetTitle>
          <SheetDescription>
            Add a new Category to one of your account.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Icon
            </Label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Name
            </Label>
            <Input
              id="description"
              placeholder="Food"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Nom nom"
              className="col-span-3"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={create}>
              Create Category
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
