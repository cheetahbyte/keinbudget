import { FolderTree, Pencil, Trash2 } from "lucide-react";

import { PaginationControls } from "#/components/dashboard/PaginationControls";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { usePaginatedItems } from "#/hooks/usePaginatedItems";
import type { Category } from "#/lib/dashboard/types";

interface CategoriesTableProps {
  categories: Category[];
  deleteCategoryAction: (formData: FormData) => Promise<void>;
  onEdit: (category: Category) => void;
}

export function CategoriesTable({
  categories,
  deleteCategoryAction,
  onEdit,
}: CategoriesTableProps) {
  const {
    currentPage,
    pageItems,
    pageSize,
    setCurrentPage,
    setPageSize,
    totalPages,
    visibleItems: visibleCategories,
  } = usePaginatedItems(categories);

  if (categories.length === 0) {
    return (
      <Card className="rounded-[2rem] border border-dashed border-[#d7c8b3] bg-[#fdf8f1] py-0 shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-3 px-8 py-14 text-center">
          <div className="flex size-16 items-center justify-center rounded-[1.5rem] bg-[#f2e1c7] text-[#5d4b3c]">
            <FolderTree className="size-8" />
          </div>
          <h3 className="text-2xl font-semibold text-[#2e241d]">
            No categories yet
          </h3>
          <p className="max-w-xl text-base text-[#75685f]">
            Create a category to group subscriptions and make the breakdown
            easier to scan.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card/50">
        {visibleCategories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between gap-4 border-border px-5 py-4 not-last:border-b"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-lg">
                {category.icon}
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {category.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => onEdit(category)}
              >
                <Pencil className="size-3.5" />
                <span className="sr-only">Edit {category.name}</span>
              </Button>

              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={category.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Delete {category.name}</span>
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <PaginationControls
        anchorId="categories"
        currentPage={currentPage}
        pageItems={pageItems}
        pageSize={pageSize}
        totalPages={totalPages}
        rowsPerPageId="select-category-rows-per-page"
        onPageChange={setCurrentPage}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
