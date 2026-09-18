import { describe, expect, it } from "vitest";

import { dataExportSchema } from "#/schemas/data";

const data = {
  version: "2.0",
  categories: ["expense", "savings", "income"].map((type, id) => ({
    id,
    name: type,
    icon: "icon",
    type,
  })),
  entries: [0, 1, 2, null].map((categoryId, id) => ({
    id,
    name: `Entry ${id}`,
    price: 100,
    billingInterval: "monthly",
    categoryId,
  })),
};

describe("data export parsing", () => {
  it("round-trips all category types and uncategorized entries", () => {
    expect(dataExportSchema.parse(JSON.parse(JSON.stringify(data)))).toEqual(
      data,
    );
  });

  it("accepts empty modern exports", () => {
    expect(
      dataExportSchema.parse({ version: "2.0", entries: [], categories: [] }),
    ).toEqual({ version: "2.0", entries: [], categories: [] });
  });

  it.each(["1.0", "3.0", undefined])("rejects version %s", (version) => {
    expect(dataExportSchema.safeParse({ ...data, version }).success).toBe(
      false,
    );
  });

  it("rejects legacy exports", () => {
    expect(
      dataExportSchema.safeParse({
        version: "1.0",
        subscriptions: [],
        categories: [],
      }).success,
    ).toBe(false);
  });

  it("rejects legacy fields, missing collections, and missing or invalid types", () => {
    for (const invalid of [
      { ...data, subscriptions: [] },
      { ...data, entries: undefined },
      { ...data, categories: undefined },
      ...[undefined, "investment"].map((type) => ({
        ...data,
        categories: [{ ...data.categories[0], type }],
      })),
    ]) {
      expect(dataExportSchema.safeParse(invalid).success).toBe(false);
    }
  });
});
