import { getTableName, type Table } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import type { DrizzleClient } from "#/db";

import { SubscriptionService } from "./subscriptions";

const category = { id: 7, name: "Food", icon: "🍎", type: "expense" };
const changedAt = new Date("2026-01-01T00:00:00.000Z");

function row(categoryId: number | null, price = 10) {
  return {
    id: 1,
    name: "Lunch",
    price,
    billingInterval: "monthly" as const,
    categoryId,
    notes: "",
    isActive: true,
    nextBillingDate: null,
  };
}

function mockDb(options: { history: { price: number }[]; row: object }) {
  const operations: string[] = [];
  const db = {
    select: (columns: Record<string, unknown>) => ({
      from: () => ({
        // Thenable so awaiting it is a category lookup and .orderBy() is not
        where: () => ({
          // oxlint-disable-next-line unicorn/no-thenable
          then(resolve: (rows: object[]) => void) {
            operations.push("category lookup");
            resolve([category]);
          },
          orderBy: async () => {
            operations.push("history lookup");
            return options.history.map((change) => ({
              subscriptionId: 1,
              price: change.price,
              changedAt,
            }));
          },
        }),
      }),
      columns,
    }),
    insert: (table: Table) => ({
      values: (values: { price: number }) => ({
        returning: async () => {
          if (getTableName(table) === "price_history") {
            operations.push("history write");
            return [{ price: values.price, changedAt }];
          }
          operations.push("write");
          return [options.row];
        },
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => ({
          returning: async () => {
            operations.push("write");
            return [options.row];
          },
        }),
      }),
    }),
  };
  return { db: db as unknown as DrizzleClient, operations };
}

describe("SubscriptionService.create", () => {
  it.each([null, 7])(
    "records the initial price and resolves category %s",
    async (categoryId) => {
      const { db, operations } = mockDb({ history: [], row: row(categoryId) });
      const service = new SubscriptionService(db);

      expect(await service.create("user", row(categoryId))).toEqual({
        ...row(categoryId),
        categoryId: undefined,
        priceHistory: [{ price: 10, changedAt: changedAt.toISOString() }],
        category: categoryId === null ? null : category,
      });
      expect(operations).toEqual(
        categoryId === null
          ? ["write", "history write"]
          : ["category lookup", "write", "history write", "category lookup"],
      );
    },
  );
});

describe("SubscriptionService.update", () => {
  it("does not record history when the price is unchanged", async () => {
    const { db, operations } = mockDb({
      history: [{ price: 10 }],
      row: row(null),
    });
    const service = new SubscriptionService(db);

    const result = await service.update("user", row(null));

    expect(result.priceHistory).toEqual([
      { price: 10, changedAt: changedAt.toISOString() },
    ]);
    expect(operations).toEqual(["write", "history lookup"]);
  });

  it("prepends a history entry when the price changes", async () => {
    const { db, operations } = mockDb({
      history: [{ price: 10 }],
      row: row(null, 12),
    });
    const service = new SubscriptionService(db);

    const result = await service.update("user", row(null, 12));

    expect(result.priceHistory.map((change) => change.price)).toEqual([12, 10]);
    expect(operations).toEqual(["write", "history lookup", "history write"]);
  });

  it("throws when nothing was updated", async () => {
    const db = {
      select: () => ({ from: () => ({ where: async () => [] }) }),
      update: () => ({
        set: () => ({ where: () => ({ returning: async () => [] }) }),
      }),
    } as unknown as DrizzleClient;

    await expect(
      new SubscriptionService(db).update("user", row(null)),
    ).rejects.toThrow("Subscription not found");
  });
});
