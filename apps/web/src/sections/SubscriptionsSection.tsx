"use client";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriesTable } from "./subscriptions/CategoriesTable";
import { SubscriptionsTable } from "./subscriptions/SubscriptionsTable";

type Category = {
  id: number;
  name: string;
  icon: string;
};

type Subscription = {
  id: number;
  name: string;
  price: number;
  billingInterval: "monthly" | "weekly" | "yearly";
  category: Category | null;
};

interface ActiveSubscriptionsProps {
  categories: Category[];
  createCategoryAction: (formData: FormData) => Promise<void>;
  createSubscriptionAction: (formData: FormData) => Promise<void>;
  deleteCategoryAction: (formData: FormData) => Promise<void>;
  deleteSubscriptionAction: (formData: FormData) => Promise<void>;
  subscriptions: Subscription[];
}

export function ActiveSubscriptions({
  categories,
  createCategoryAction,
  createSubscriptionAction,
  deleteCategoryAction,
  deleteSubscriptionAction,
  subscriptions,
}: ActiveSubscriptionsProps) {
  const [tab, setTab] = useState("sub");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 w-full">
            <Tabs
              defaultValue="sub"
              className="w-full"
              value={tab}
              onValueChange={setTab}
            >
              <div className="flex flex-row items-center gap-2 justify-between">
                <div className="flex flex-row items-center gap-2 ">
                  <TabsList>
                    <TabsTrigger value="sub">Subscriptions</TabsTrigger>
                    <TabsTrigger value="cat">Categories</TabsTrigger>
                  </TabsList>
                  <p className="text-xs text-muted-foreground">
                    {subscriptions.length} total
                  </p>
                </div>
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    if (tab === "sub") {
                      setIsSubscriptionOpen(true);
                    } else {
                      setIsCategoryOpen(true);
                    }
                  }}
                >
                  <Plus className="size-3.5" />
                  Add New {tab === "sub" ? "Subscription" : "Category"}
                </Button>
              </div>
              <TabsContent value="sub">
                <SubscriptionsTable
                  deleteSubscriptionAction={deleteSubscriptionAction}
                  subscriptions={subscriptions}
                />
              </TabsContent>
              <TabsContent value="cat">
                <CategoriesTable
                  categories={categories}
                  deleteCategoryAction={deleteCategoryAction}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a category</DialogTitle>
                  <DialogDescription>
                    Categories are optional. Give each one a name and icon for
                    the subscription list.
                  </DialogDescription>
                </DialogHeader>
                <form
                  action={async (formData) => {
                    await createCategoryAction(formData);
                    setIsCategoryOpen(false);
                  }}
                  className="grid gap-5"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="category-name">Name</Label>
                    <Input
                      id="category-name"
                      name="name"
                      placeholder="Streaming"
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
                      required
                      className="h-12 rounded-xl border-[#d8c9b6] bg-white px-4 text-base"
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-xl"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-xl bg-[#2e241d] text-white hover:bg-[#433226]"
                    >
                      Create category
                    </Button>
                  </DialogFooter>
                </form>
                {categories.length > 0 ? (
                  <div className="grid gap-2">
                    <p className="text-sm font-medium text-[#2e241d]">
                      Existing categories
                    </p>
                    <div className="flex flex-col gap-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between rounded-xl bg-[#f8f1e7] px-3 py-2 text-sm text-[#75685f]"
                        >
                          <span>
                            {category.icon} {category.name}
                          </span>
                          <form
                            action={async (formData) => {
                              await deleteCategoryAction(formData);
                            }}
                          >
                            <input
                              type="hidden"
                              name="id"
                              value={category.id}
                            />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon-sm"
                              className="text-[#8c6e5a] hover:bg-[#efdfca] hover:text-[#5a3f2d]"
                            >
                              <Trash2 className="size-3.5" />
                              <span className="sr-only">
                                Delete {category.name}
                              </span>
                            </Button>
                          </form>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </DialogContent>
            </Dialog>
            <Dialog
              open={isSubscriptionOpen}
              onOpenChange={setIsSubscriptionOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new subscription</DialogTitle>
                  <DialogDescription>
                    Add a monthly price and optionally attach a category.
                  </DialogDescription>
                </DialogHeader>
                <form
                  action={async (formData) => {
                    await createSubscriptionAction(formData);
                    setIsSubscriptionOpen(false);
                  }}
                  className="grid gap-5"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="subscription-name">Name</Label>
                    <Input
                      id="subscription-name"
                      name="name"
                      placeholder="Netflix, Spotify, iCloud+..."
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
                      defaultValue="monthly"
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
                      defaultValue=""
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
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-xl"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-xl bg-[#2e241d] text-white hover:bg-[#433226]"
                    >
                      Create subscription
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
