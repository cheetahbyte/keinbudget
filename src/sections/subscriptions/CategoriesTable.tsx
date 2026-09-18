import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";

import { PaginationControls } from "#/components/dashboard/PaginationControls";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { usePaginatedItems } from "#/hooks/usePaginatedItems";
import { getCategoryTypeLabel } from "#/lib/category-type";
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
      <div className="rounded-md bg-card px-6 py-10 ring-1 ring-border">
        <h3 className="text-lg font-medium">No categories yet</h3>
        <p className="mt-1 max-w-prose text-muted-foreground">
          Categories group entries in the breakdown and decide whether an entry
          counts as an expense, savings or income.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-border rounded-md bg-card ring-1 ring-border">
        {visibleCategories.map((category) => (
          <li key={category.id} className="flex items-center gap-4 px-5 py-3.5">
            <span aria-hidden className="w-6 text-center text-lg">
              {category.icon}
            </span>

            <h3 className="min-w-0 flex-1 truncate font-medium">
              {category.name}
            </h3>

            <p className="text-sm text-muted-foreground">
              {getCategoryTypeLabel(category.type)}
            </p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Actions for ${category.name}`}
                >
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(category)}>
                  <Pencil className="size-3.5" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    const formData = new FormData();
                    formData.set("id", String(category.id));
                    deleteCategoryAction(formData);
                  }}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>

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
