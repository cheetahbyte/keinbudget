"use client";

import { FolderTree, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = {
  id: number;
  name: string;
  icon: string;
};

interface CategoriesTableProps {
  categories: Category[];
  deleteCategoryAction: (formData: FormData) => Promise<void>;
}

type PageSizes = 5 | 10 | 20;
const PAGE_SIZE_OPTIONS: PageSizes[] = [5, 10, 20];

function getPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}

export function CategoriesTable({
  categories,
  deleteCategoryAction,
}: CategoriesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizes>(5);

  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const startIndex = (currentPage - 1) * pageSize;
  const visibleCategories = categories.slice(startIndex, startIndex + pageSize);
  const pageItems = getPageItems(currentPage, totalPages);
  let ellipsisCount = 0;

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
                {/*<p className="text-xs text-muted-foreground">Custom category</p>*/}
              </div>
            </div>

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
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Field orientation="horizontal" className="w-fit gap-3">
          <FieldLabel htmlFor="select-category-rows-per-page">
            Rows per page
          </FieldLabel>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value) as PageSizes);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20" id="select-category-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        {totalPages > 1 ? (
          <Pagination className="mx-0 w-auto sm:ml-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#categories"
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                />
              </PaginationItem>

              {pageItems.map((item) => {
                const key =
                  item === "ellipsis"
                    ? `ellipsis-${++ellipsisCount}`
                    : `page-${item}`;

                return (
                  <PaginationItem key={key}>
                    {item === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#categories"
                        isActive={item === currentPage}
                        onClick={(event) => {
                          event.preventDefault();
                          setCurrentPage(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#categories"
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}
