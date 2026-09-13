import { describe, expect, it } from "vitest";

import { dataExportSchema, dataExportV1Schema } from "#/schemas/data";

describe("data export parsing", () => {
  it("defaults legacy categories without type to expense", () => {
    const result = dataExportSchema.safeParse({
      version: "1.0",
      categories: [{ id: 1, name: "Streaming", icon: "tv" }],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.categories).toEqual([
      { id: 1, name: "Streaming", icon: "tv", type: "expense" },
    ]);
    expect(result.data.subscriptions).toEqual([]);
  });

  it("preserves all category types on export", () => {
    const types = ["expense", "income", "savings"] as const;
    for (const type of types) {
      const parsed = dataExportV1Schema.parse({
        version: "1.0",
        categories: [{ id: 1, name: "Type", icon: "icon", type }],
      });

      expect(parsed.categories[0]?.type).toBe(type);
    }
  });

  it("rejects invalid category type", () => {
    const result = dataExportV1Schema.safeParse({
      version: "1.0",
      categories: [
        { id: 1, name: "Streaming", icon: "tv", type: "investment" },
      ],
    });

    expect(result.success).toBe(false);
  });
});
