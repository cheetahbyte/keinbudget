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
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium">No categories yet</h3>
        <p className="max-w-prose text-muted-foreground">
          Categories group entries in the breakdown and decide whether an entry
          counts as an expense, savings or income.
        </p>
      </div>
    );
  }

  return (
    <div id="categories" className="flex flex-col gap-6">
      <ul className="divide-y divide-border">
        {visibleCategories.map((category) => (
          <li
            key={category.id}
            className="flex items-center gap-3 py-3 sm:gap-6"
          >
            <span aria-hidden className="w-5 shrink-0 text-center text-sm">
              {category.icon}
            </span>

            <h3 className="min-w-0 flex-1 truncate text-sm">{category.name}</h3>

            <p className="shrink-0 text-sm text-muted-foreground">
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
