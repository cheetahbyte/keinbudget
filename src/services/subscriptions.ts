import { and, desc, eq, inArray } from "drizzle-orm";

import type { DrizzleClient } from "#/db";
import { categories, priceHistory, subscriptions } from "#/db";
import type { BillingInterval } from "#/lib/billing-interval";
import { toMonthlyPrice } from "#/lib/billing-interval";
import { computeMonthlyProjections } from "#/lib/projections";
import { nextOccurrence, todayIso } from "#/lib/renewals";
import type { Category, PriceChange, Subscription } from "#/schemas";

type SubInsertInput = Omit<typeof subscriptions.$inferInsert, "id" | "userId">;

interface EntryInput {
  name: string;
  price: number;
  billingInterval: BillingInterval;
  categoryId: number | null;
  notes: string;
  isActive: boolean;
  nextBillingDate: string | null;
}

const entryColumns = {
  id: subscriptions.id,
  name: subscriptions.name,
  price: subscriptions.price,
  billingInterval: subscriptions.billingInterval,
  categoryId: subscriptions.categoryId,
  notes: subscriptions.notes,
  isActive: subscriptions.isActive,
  nextBillingDate: subscriptions.nextBillingDate,
};

interface EntryRow extends EntryInput {
  id: number;
}

function upcoming(row: {
  nextBillingDate: string | null;
  billingInterval: BillingInterval;
}): string | null {
  return row.nextBillingDate === null
    ? null
    : nextOccurrence(row.nextBillingDate, row.billingInterval, todayIso());
}

export class SubscriptionService {
  constructor(private readonly db: DrizzleClient) {}

  async findAll(userId: string): Promise<Subscription[]> {
    const rows = await this.db
      .select({
        ...entryColumns,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          type: categories.type,
        },
      })
      .from(subscriptions)
      .leftJoin(categories, eq(subscriptions.categoryId, categories.id))
      .where(eq(subscriptions.userId, userId));

    const history = await this.findPriceHistory(rows.map((row) => row.id));

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      billingInterval: row.billingInterval,
      notes: row.notes,
      isActive: row.isActive,
      nextBillingDate: upcoming(row),
      priceHistory: history.get(row.id) ?? [],
      category:
        row.category?.id == null
          ? null
          : {
              id: row.category.id,
              name: row.category.name,
              icon: row.category.icon,
              type: row.category.type,
            },
    }));
  }

  private async findPriceHistory(
    subscriptionIds: number[],
  ): Promise<Map<number, PriceChange[]>> {
    const grouped = new Map<number, PriceChange[]>();
    if (subscriptionIds.length === 0) return grouped;
    const rows = await this.db
      .select({
        subscriptionId: priceHistory.subscriptionId,
        price: priceHistory.price,
        changedAt: priceHistory.changedAt,
      })
      .from(priceHistory)
      .where(inArray(priceHistory.subscriptionId, subscriptionIds))
      .orderBy(desc(priceHistory.changedAt), desc(priceHistory.id));
    for (const row of rows) {
      const list = grouped.get(row.subscriptionId) ?? [];
      list.push({ price: row.price, changedAt: row.changedAt.toISOString() });
      grouped.set(row.subscriptionId, list);
    }
    return grouped;
  }

  async findAllForExport(userId: string) {
    return this.db
      .select(entryColumns)
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
  }

  async calculateMonthlyProjections(userId: string) {
    const rows = await this.db
      .select({
        price: subscriptions.price,
        billingInterval: subscriptions.billingInterval,
        type: categories.type,
      })
      .from(subscriptions)
      .leftJoin(categories, eq(subscriptions.categoryId, categories.id))
      .where(
        and(eq(subscriptions.userId, userId), eq(subscriptions.isActive, true)),
      );

    return computeMonthlyProjections(
      rows.map((row) => ({
        price: row.price,
        billingInterval: row.billingInterval ?? "monthly",
        type: row.type,
      })),
    );
  }

  async calculateMonthlyCosts(userId: string) {
    const rows = await this.findAll(userId);

    return rows
      .filter((subscription) => subscription.isActive)
      .map((subscription) => ({
        id: subscription.id,
        name: subscription.name,
        price: subscription.price,
        billingInterval: subscription.billingInterval,
        monthlyPrice: toMonthlyPrice(
          subscription.price,
          subscription.billingInterval ?? "monthly",
        ),
      }));
  }

  private findCategoryById(userId: string, categoryId: number) {
    return this.db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        type: categories.type,
      })
      .from(categories)
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)));
  }

  private async resolveCategoryId(
    userId: string,
    categoryId: number | null,
  ): Promise<number | null> {
    if (categoryId === null) return null;
    const [category] = await this.findCategoryById(userId, categoryId);
    if (!category) throw new Error("Invalid category");
    return category.id;
  }

  private async toSubscription(
    userId: string,
    row: EntryRow,
    history: PriceChange[],
  ): Promise<Subscription> {
    const [category] =
      row.categoryId == null
        ? []
        : await this.findCategoryById(userId, row.categoryId);
    return {
      id: row.id,
      name: row.name,
      price: row.price,
      billingInterval: row.billingInterval,
      notes: row.notes,
      isActive: row.isActive,
      nextBillingDate: upcoming(row),
      priceHistory: history,
      category: (category as Category | undefined) ?? null,
    };
  }

  private async recordPrice(
    subscriptionId: number,
    price: number,
  ): Promise<PriceChange> {
    const [row] = await this.db
      .insert(priceHistory)
      .values({ subscriptionId, price })
      .returning({
        price: priceHistory.price,
        changedAt: priceHistory.changedAt,
      });
    return { price: row.price, changedAt: row.changedAt.toISOString() };
  }

  async create(userId: string, input: EntryInput): Promise<Subscription> {
    const categoryId = await this.resolveCategoryId(userId, input.categoryId);

    const [subscription] = await this.db
      .insert(subscriptions)
      .values({ userId, ...input, categoryId })
      .returning(entryColumns);

    if (!subscription) {
      throw new Error("Failed to create subscription");
    }

    const change = await this.recordPrice(subscription.id, subscription.price);
    return this.toSubscription(userId, subscription, [change]);
  }

  async bulkCreate(userId: string, input: SubInsertInput[]) {
    if (input.length === 0) return [];
    const rows = await this.db
      .insert(subscriptions)
      .values(input.map((s) => ({ userId, ...s })))
      .returning(entryColumns);
    if (rows.length > 0) {
      await this.db
        .insert(priceHistory)
        .values(
          rows.map((row) => ({ subscriptionId: row.id, price: row.price })),
        );
    }
    return rows;
  }

  async update(
    userId: string,
    input: EntryInput & { id: number },
  ): Promise<Subscription> {
    const categoryId = await this.resolveCategoryId(userId, input.categoryId);

    const result = await this.db
      .update(subscriptions)
      .set({
        name: input.name,
        price: input.price,
        billingInterval: input.billingInterval,
        categoryId,
        notes: input.notes,
        isActive: input.isActive,
        nextBillingDate: input.nextBillingDate,
      })
      .where(
        and(eq(subscriptions.id, input.id), eq(subscriptions.userId, userId)),
      )
      .returning(entryColumns);

    if (result.length === 0) {
      throw new Error("Subscription not found");
    }

    const subscription = result[0];
    const history =
      (await this.findPriceHistory([subscription.id])).get(subscription.id) ??
      [];
    if (history[0]?.price !== subscription.price) {
      history.unshift(
        await this.recordPrice(subscription.id, subscription.price),
      );
    }
    return this.toSubscription(userId, subscription, history);
  }

  async remove(userId: string, id: number) {
    const result = await this.db
      .delete(subscriptions)
      .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
      .returning({ id: subscriptions.id });

    if (result.length === 0) {
      throw new Error("Subscription not found");
    }

    return { success: true as const };
  }
}
