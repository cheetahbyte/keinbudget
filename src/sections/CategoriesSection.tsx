import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AddCategoryDialog } from "#/components/dashboard/AddCategoryDialog";
import { Button } from "#/components/ui/button";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "#/functions/categories";
import {
  parseCreateCategoryFormData,
  parseEntityIdFormData,
  parseUpdateCategoryFormData,
} from "#/lib/dashboard/mutations";
import { dashboardQueryKeys } from "#/lib/dashboard/queries";
import type { Category } from "#/lib/dashboard/types";

import { CategoriesTable } from "./subscriptions/CategoriesTable";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const queryClient = useQueryClient();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  function openCreateCategory() {
    setEditingCategory(null);
    setIsCategoryOpen(true);
  }

  function openEditCategory(category: Category) {
    setEditingCategory(category);
    setIsCategoryOpen(true);
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
        // Category type changes which projection bucket its entries land in.
        queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.projections(),
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
      // Entries lose their category and fall back to expense.
      queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.projections(),
      }),
    ]);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <div className="flex w-full flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-2xl font-medium tracking-tight">Categories</h1>
          <Button className="cursor-pointer" onClick={openCreateCategory}>
            <Plus data-icon="inline-start" />
            Add category
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {categories.length} categories
        </p>
      </div>

      <CategoriesTable
        categories={categories}
        deleteCategoryAction={handleDeleteCategory}
        onEdit={openEditCategory}
      />

      <AddCategoryDialog
        open={isCategoryOpen}
        onOpenChange={(open) => {
          setIsCategoryOpen(open);
          if (!open) setEditingCategory(null);
        }}
        onSubmit={handleSubmitCategory}
        category={editingCategory ?? undefined}
      />
    </div>
  );
}
