// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";

import { usePaginatedItems } from "./usePaginatedItems";

it("clamps the page when items shrink and keeps it there when they grow", () => {
  const items = Array.from({ length: 11 }, (_, index) => index);
  const { result, rerender } = renderHook(
    ({ items }) => usePaginatedItems(items),
    { initialProps: { items } },
  );

  act(() => result.current.setCurrentPage(3));
  expect(result.current.visibleItems).toEqual([10]);

  rerender({ items: items.slice(0, 6) });
  expect(result.current.currentPage).toBe(2);
  expect(result.current.visibleItems).toEqual([5]);

  rerender({ items });
  expect(result.current.currentPage).toBe(2);

  rerender({ items: [] });
  expect(result.current.currentPage).toBe(1);
  expect(result.current.totalPages).toBe(1);
  expect(result.current.visibleItems).toEqual([]);
});
