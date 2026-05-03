import { describe, expect, it } from "vitest";

import { getPageItems } from "#/lib/dashboard/pagination";

describe("getPageItems", () => {
  it("returns every page when the total page count is small", () => {
    expect(getPageItems(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("builds a centered pagination window for middle pages", () => {
    expect(getPageItems(5, 10)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      10,
    ]);
  });

  it("builds the trailing window near the end of the list", () => {
    expect(getPageItems(9, 10)).toEqual([1, "ellipsis", 7, 8, 9, 10]);
  });
});
