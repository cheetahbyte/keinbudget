import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AddCategoryDialog } from "#/components/dashboard/AddCategoryDialog";
import { AddSubscriptionDialog } from "#/components/dashboard/AddSubscriptionDialog";
import { Button } from "#/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "#/functions/categories";
import {
  createSubscription,
  deleteSubscription,
  updateSubscription,
} from "#/functions/subscriptions";
import {
  parseCreateCategoryFormData,
  parseCreateSubscriptionFormData,
  parseEntityIdFormData,
  parseUpdateCategoryFormData,
  parseUpdateSubscriptionFormData,
} from "#/lib/dashboard/mutations";
import { dashboardQueryKeys } from "#/lib/dashboard/queries";
import type { Category, Subscription } from "#/lib/dashboard/types";
import { CategoriesTable } from "./subscriptions/CategoriesTable";
import { SubscriptionsTable } from "./subscriptions/SubscriptionsTable";

interface ActiveSubscriptionsProps {
  categories: Category[];
  currency: string;
  subscriptions: Subscription[];
}

export function ActiveSubscriptions({
  categories,
  currency,
  subscriptions,
}: ActiveSubscriptionsProps) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("sub");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);

  function openCreateCategory() {
    setEditingCategory(null);
    setIsCategoryOpen(true);
  }

  function openEditCategory(category: Category) {
    setEditingCategory(category);
    setIsCategoryOpen(true);
  }

  function openCreateSubscription() {
    setEditingSubscription(null);
    setIsSubscriptionOpen(true);
  }

  function openEditSubscription(subscription: Subscription) {
    setEditingSubscription(subscription);
    setIsSubscriptionOpen(true);
  }

  async function handleSubmitCategory(formData: FormData) {
    if (editingCategory) {
      const input = parseUpdateCategoryFormData(formData);
      if (!input) return;
      await updateCategory({ data: input });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.categories(),
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.subscriptions(),
        }),
      ]);
    } else {
      const input = parseCreateCategoryFormData(formData);
      if (!input) return;
      await createCategory({ data: input });
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.categories(),
      });
    }
  }

  async function handleSubmitSubscription(formData: FormData) {
    if (editingSubscription) {
      const input = parseUpdateSubscriptionFormData(formData);
      if (!input) return;
      await updateSubscription({ data: input });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.subscriptions(),
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.stats(),
        }),
      ]);
    } else {
      const input = parseCreateSubscriptionFormData(formData);
      if (!input) return;
      await createSubscription({ data: input });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.subscriptions(),
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.stats(),
        }),
      ]);
    }
  }

  async function handleDeleteCategory(formData: FormData) {
    const input = parseEntityIdFormData(formData);
    if (!input) return;
    await deleteCategory({ data: { id: input.id } });
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.categories(),
      }),
      queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.subscriptions(),
      }),
    ]);
  }

  async function handleDeleteSubscription(formData: FormData) {
    const input = parseEntityIdFormData(formData);
    if (!input) return;
    await deleteSubscription({ data: { id: input.id } });
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.subscriptions(),
      }),
      queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.stats(),
      }),
    ]);
  }

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
                      openCreateSubscription();
                    } else {
                      openCreateCategory();
                    }
                  }}
                >
                  <Plus className="size-3.5" />
                  Add New {tab === "sub" ? "Subscription" : "Category"}
                </Button>
              </div>
              <TabsContent value="sub">
                <SubscriptionsTable
                  currency={currency}
                  deleteSubscriptionAction={handleDeleteSubscription}
                  onEdit={openEditSubscription}
                  subscriptions={subscriptions}
                />
              </TabsContent>
              <TabsContent value="cat">
                <CategoriesTable
                  categories={categories}
                  deleteCategoryAction={handleDeleteCategory}
                  onEdit={openEditCategory}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <AddCategoryDialog
              open={isCategoryOpen}
              onOpenChange={(open) => {
                setIsCategoryOpen(open);
                if (!open) setEditingCategory(null);
              }}
              onSubmit={handleSubmitCategory}
              category={editingCategory ?? undefined}
            />

            <AddSubscriptionDialog
              categories={categories}
              open={isSubscriptionOpen}
              onOpenChange={(open) => {
                setIsSubscriptionOpen(open);
                if (!open) setEditingSubscription(null);
              }}
              onSubmit={handleSubmitSubscription}
              subscription={editingSubscription ?? undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
