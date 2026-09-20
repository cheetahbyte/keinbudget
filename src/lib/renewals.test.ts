import { describe, expect, it } from "vitest";

import {
  buildUpcomingRenewals,
  daysUntil,
  formatRelativeDays,
  nextOccurrence,
  nthOccurrence,
} from "#/lib/renewals";

describe("nthOccurrence", () => {
  it("clamps month-end anchors without drifting", () => {
    expect(nthOccurrence("2026-01-31", "monthly", 1)).toBe("2026-02-28");
    expect(nthOccurrence("2026-01-31", "monthly", 2)).toBe("2026-03-31");
    expect(nthOccurrence("2024-02-29", "yearly", 1)).toBe("2025-02-28");
  });

  it("steps weekly anchors by seven days", () => {
    expect(nthOccurrence("2026-09-01", "weekly", 3)).toBe("2026-09-22");
  });

  it("crosses year boundaries for long intervals", () => {
    expect(nthOccurrence("2025-11-15", "quarterly", 1)).toBe("2026-02-15");
    expect(nthOccurrence("2025-06-01", "biennial", 1)).toBe("2027-06-01");
  });
});

describe("nextOccurrence", () => {
  it("keeps future or same-day anchors", () => {
    expect(nextOccurrence("2026-09-20", "monthly", "2026-09-20")).toBe(
      "2026-09-20",
    );
    expect(nextOccurrence("2026-10-05", "monthly", "2026-09-20")).toBe(
      "2026-10-05",
    );
  });

  it("advances past anchors to the first occurrence on or after today", () => {
    expect(nextOccurrence("2024-01-31", "monthly", "2026-09-20")).toBe(
      "2026-09-30",
    );
    expect(nextOccurrence("2020-03-10", "yearly", "2026-09-20")).toBe(
      "2027-03-10",
    );
    expect(nextOccurrence("2026-09-01", "weekly", "2026-09-20")).toBe(
      "2026-09-22",
    );
  });
});

describe("buildUpcomingRenewals", () => {
  const base = {
    price: 10,
    billingInterval: "monthly" as const,
    isActive: true,
  };

  it("lists active dated entries within the window, soonest first", () => {
    const renewals = buildUpcomingRenewals(
      [
        { ...base, id: 1, name: "B", nextBillingDate: "2026-09-25" },
        { ...base, id: 2, name: "A", nextBillingDate: "2026-09-25" },
        { ...base, id: 3, name: "Old", nextBillingDate: "2026-08-21" },
        { ...base, id: 4, name: "Far", nextBillingDate: "2026-12-01" },
        { ...base, id: 5, name: "Undated", nextBillingDate: null },
        {
          ...base,
          id: 6,
          name: "Paused",
          isActive: false,
          nextBillingDate: "2026-09-21",
        },
      ],
      "2026-09-20",
      30,
    );

    expect(
      renewals.map((renewal) => [renewal.entry.name, renewal.daysUntil]),
    ).toEqual([
      ["Old", 1],
      ["A", 5],
      ["B", 5],
    ]);
    expect(renewals[0].date).toBe("2026-09-21");
  });
});

it("formats day distances", () => {
  expect(daysUntil("2026-09-22", "2026-09-20")).toBe(2);
  expect(formatRelativeDays(0)).toBe("today");
  expect(formatRelativeDays(1)).toBe("tomorrow");
  expect(formatRelativeDays(9)).toBe("in 9 days");
});
