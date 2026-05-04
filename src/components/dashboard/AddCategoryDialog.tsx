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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit category" : "Create a category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the name and icon for this category."
              : "Categories are optional. Give each one a name and icon for the subscription list."}
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
              className="h-12 rounded-xl border-[#d8c9b6] bg-white px-4 text-base"
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
              className="h-12 rounded-xl border-[#d8c9b6] bg-white px-4 text-base"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg" className="rounded-xl">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="lg"
              className="rounded-xl bg-[#2e241d] text-white hover:bg-[#433226]"
            >
              {isEdit ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
