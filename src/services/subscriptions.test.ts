import { describe, expect, it, vi } from "vitest";

import type { DrizzleClient } from "#/db";

import { SubscriptionService } from "./subscriptions";

describe.each(["create", "update"] as const)(
  "SubscriptionService.%s",
  (method) => {
    it.each([null, 7])(
      "preserves the response and query order for category %s",
      async (categoryId) => {
        const category = { id: 7, name: "Food", icon: "🍎", type: "expense" };
        const subscription = {
          id: 1,
          name: "Lunch",
          price: 10,
          billingInterval: "monthly" as const,
          categoryId,
        };
        const operations: string[] = [];
        const where = vi.fn(async () => {
          operations.push("category lookup");
          return [category];
        });
        const returning = vi.fn(async () => {
          operations.push("write");
          return [subscription];
        });
        const db = {
          select: () => ({ from: () => ({ where }) }),
          insert: () => ({ values: () => ({ returning }) }),
          update: () => ({ set: () => ({ where: () => ({ returning }) }) }),
        };
        const service = new SubscriptionService(db as unknown as DrizzleClient);

        expect(await service[method]("user", subscription)).toEqual({
          id: 1,
          name: "Lunch",
          price: 10,
          billingInterval: "monthly",
          category: categoryId === null ? null : category,
        });
        expect(operations).toEqual(
          categoryId === null
            ? ["write"]
            : ["category lookup", "write", "category lookup"],
        );
      },
    );
  },
);
