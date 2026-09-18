import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { CATEGORY_TYPES, getCategoryTypeLabel } from "#/lib/category-type";
import type { Category } from "#/lib/dashboard/types";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  category?: Category;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  category,
}: AddCategoryDialogProps) {
  const isEdit = category != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit category" : "Create a category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Changing the type reclassifies all entries in this category. Deleting the category makes them expenses."
              : "Categories are optional. Give each one a name, icon and type for the recurring entries list."}
          </DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            await onSubmit(formData);
            onOpenChange(false);
          }}
          className="grid gap-5"
        >
          {isEdit && <input type="hidden" name="id" value={category.id} />}

          <div className="grid gap-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              name="name"
              placeholder="Streaming"
              defaultValue={isEdit ? category.name : undefined}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category-icon">Icon</Label>
            <Input
              id="category-icon"
              name="icon"
              placeholder="📺"
              defaultValue={isEdit ? category.icon : undefined}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category-type">Type</Label>
            <select
              id="category-type"
              name="type"
              defaultValue={isEdit ? category.type : "expense"}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {CATEGORY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {getCategoryTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" size="lg">
              {isEdit ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
