import { useEffect, useState } from "react";

import { getPageItems, type PageSize } from "#/lib/dashboard/pagination";

export function usePaginatedItems<T>(
  items: T[],
  initialPageSize: PageSize = 5,
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * pageSize;

  return {
    currentPage,
    pageItems: getPageItems(currentPage, totalPages),
    pageSize,
    setCurrentPage,
    setPageSize,
    totalPages,
    visibleItems: items.slice(startIndex, startIndex + pageSize),
  };
}
