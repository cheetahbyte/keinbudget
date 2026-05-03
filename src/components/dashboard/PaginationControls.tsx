import { Field, FieldLabel } from "#/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "#/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { PAGE_SIZE_OPTIONS, type PageSize } from "#/lib/dashboard/pagination";

interface PaginationControlsProps {
  anchorId: string;
  currentPage: number;
  pageItems: readonly (number | "ellipsis")[];
  pageSize: PageSize;
  totalPages: number;
  rowsPerPageId: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: PageSize) => void;
}

export function PaginationControls({
  anchorId,
  currentPage,
  pageItems,
  pageSize,
  totalPages,
  rowsPerPageId,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  let ellipsisCount = 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Field orientation="horizontal" className="w-fit gap-3">
        <FieldLabel htmlFor={rowsPerPageId}>Rows per page</FieldLabel>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            onPageSizeChange(Number(value) as PageSize);
          }}
        >
          <SelectTrigger className="w-20" id={rowsPerPageId}>
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
                href={`#${anchorId}`}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (currentPage > 1) {
                    onPageChange(currentPage - 1);
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
                      href={`#${anchorId}`}
                      isActive={item === currentPage}
                      onClick={(event) => {
                        event.preventDefault();
                        onPageChange(item);
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
                href={`#${anchorId}`}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (currentPage < totalPages) {
                    onPageChange(currentPage + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
