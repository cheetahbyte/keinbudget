import { Plus } from "lucide-react";
import { useState } from "react";

import { AddCategoryDialog } from "#/components/dashboard/AddCategoryDialog";
import { AddSubscriptionDialog } from "#/components/dashboard/AddSubscriptionDialog";
import { Button } from "#/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import type { Category, Subscription } from "#/lib/dashboard/types";
import { CategoriesTable } from "./subscriptions/CategoriesTable";
import { SubscriptionsTable } from "./subscriptions/SubscriptionsTable";

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
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-3">
            <Tabs
              defaultValue="sub"
              className="w-full flex flex-col"
              value={tab}
              onValueChange={setTab}
            >
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  <TabsList>
                    <TabsTrigger value="sub">Subscriptions</TabsTrigger>
                    <TabsTrigger value="cat">Categories</TabsTrigger>
                  </TabsList>
                  <p className="text-xs text-muted-foreground">
                    {tab === "sub" ? subscriptions.length : categories.length}{" "}
                    total
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
            <AddCategoryDialog
              open={isCategoryOpen}
              onOpenChange={setIsCategoryOpen}
              onSubmit={createCategoryAction}
            />

            <AddSubscriptionDialog
              categories={categories}
              open={isSubscriptionOpen}
              onOpenChange={setIsSubscriptionOpen}
              onSubmit={createSubscriptionAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
