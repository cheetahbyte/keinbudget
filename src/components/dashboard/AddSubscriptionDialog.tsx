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
import type { Category, Subscription } from "#/lib/dashboard/types";

interface AddSubscriptionDialogProps {
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  subscription?: Subscription;
}

export function AddSubscriptionDialog({
  categories,
  open,
  onOpenChange,
  onSubmit,
  subscription,
}: AddSubscriptionDialogProps) {
  const isEdit = subscription != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit subscription" : "Create a new subscription"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details for this subscription."
              : "Add a monthly price and optionally attach a category."}
          </DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            await onSubmit(formData);
            onOpenChange(false);
          }}
          className="grid gap-5"
        >
          {isEdit && <input type="hidden" name="id" value={subscription.id} />}

          <div className="grid gap-2">
            <Label htmlFor="subscription-name">Name</Label>
            <Input
              id="subscription-name"
              name="name"
              placeholder="Netflix, Spotify, iCloud+..."
              defaultValue={isEdit ? subscription.name : undefined}
              required
              className="h-12 rounded-xl border-[#d8c9b6] bg-white px-4 text-base"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subscription-price">Price</Label>
            <Input
              id="subscription-price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="9.99"
              defaultValue={isEdit ? subscription.price : undefined}
              required
              className="h-12 rounded-xl border-[#d8c9b6] bg-white px-4 text-base"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subscription-billing-interval">
              Billing interval
            </Label>
            <select
              id="subscription-billing-interval"
              name="billingInterval"
              defaultValue={isEdit ? subscription.billingInterval : "monthly"}
              className="h-12 rounded-xl border border-[#d8c9b6] bg-white px-4 text-base text-[#2e241d] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subscription-category">Category</Label>
            <select
              id="subscription-category"
              name="categoryId"
              defaultValue={isEdit ? (subscription.category?.id ?? "") : ""}
              className="h-12 rounded-xl border border-[#d8c9b6] bg-white px-4 text-base text-[#2e241d] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
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
              {isEdit ? "Save changes" : "Create subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
