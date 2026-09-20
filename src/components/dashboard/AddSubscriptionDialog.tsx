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
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";
import {
  BILLING_INTERVALS,
  getBillingIntervalLabel,
} from "#/lib/billing-interval";
import { getCategoryTypeLabel } from "#/lib/category-type";
import type { Category, Subscription } from "#/lib/dashboard/types";
import { useFormatters } from "#/lib/preferences-context";

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
  const { formatMoney, formatDate } = useFormatters();
  const priceChanges = isEdit ? subscription.priceHistory.slice(0, 5) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit recurring entry" : "Create a new recurring entry"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details for this recurring entry."
              : "Add a recurring entry and optionally attach a category."}
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
              placeholder="Rent, savings plan, salary..."
              defaultValue={isEdit ? subscription.name : undefined}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subscription-price">Amount</Label>
            <Input
              id="subscription-price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="9.99"
              defaultValue={isEdit ? subscription.price : undefined}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subscription-billing-interval">Interval</Label>
            <select
              id="subscription-billing-interval"
              name="billingInterval"
              defaultValue={isEdit ? subscription.billingInterval : "monthly"}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {BILLING_INTERVALS.map((interval) => (
                <option key={interval} value={interval}>
                  {getBillingIntervalLabel(interval)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subscription-category">Category</Label>
            <select
              id="subscription-category"
              name="categoryId"
              defaultValue={isEdit ? (subscription.category?.id ?? "") : ""}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">No category (Expense)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                  {category.type !== "expense"
                    ? ` (${getCategoryTypeLabel(category.type)})`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subscription-next-billing-date">
              Next billing date{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="subscription-next-billing-date"
              name="nextBillingDate"
              type="date"
              defaultValue={
                isEdit ? (subscription.nextBillingDate ?? "") : undefined
              }
            />
            <p className="text-xs text-muted-foreground">
              Shown as an upcoming renewal on the overview. Leave empty if you
              do not track it.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subscription-notes">
              Notes{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="subscription-notes"
              name="notes"
              maxLength={2000}
              placeholder="Shared with a flatmate, cancel before summer..."
              defaultValue={isEdit ? subscription.notes : undefined}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="subscription-active">Active</Label>
              <p className="text-xs text-muted-foreground">
                Paused entries stay in the list but are left out of the totals.
              </p>
            </div>
            <input type="hidden" name="isActive" value="off" />
            <Switch
              id="subscription-active"
              name="isActive"
              defaultChecked={isEdit ? subscription.isActive : true}
            />
          </div>

          {priceChanges.length > 1 && (
            <div className="grid gap-2">
              <p className="text-sm font-medium">Price history</p>
              <ol className="divide-y divide-border text-sm">
                {priceChanges.map((change) => (
                  <li
                    key={change.changedAt}
                    className="flex items-baseline justify-between py-1.5"
                  >
                    <span className="text-muted-foreground">
                      {formatDate(change.changedAt.slice(0, 10))}
                    </span>
                    <span className="amount">{formatMoney(change.price)}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" size="lg">
              {isEdit ? "Save changes" : "Create recurring entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
