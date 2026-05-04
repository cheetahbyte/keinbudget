import { and, eq } from "drizzle-orm";
import type { DB } from "#/db";
import { categories, subscriptions } from "#/db";

function toMonthlyCost(
  price: number,
  billingInterval: "monthly" | "weekly" | "yearly",
) {
  if (billingInterval === "weekly") {
    return (price * 52) / 12;
  }

  if (billingInterval === "yearly") {
    return price / 12;
  }

  return price;
}

export function normalizeMonthlyPrice(
  price: number,
  billingInterval: "monthly" | "weekly" | "yearly",
) {
  return toMonthlyCost(price, billingInterval);
}

export class SubscriptionService {
  constructor(private readonly db: DB) {}

  async findAll(userId: string) {
    const rows = await this.db
      .select({
        id: subscriptions.id,
        name: subscriptions.name,
        price: subscriptions.price,
        billingInterval: subscriptions.billingInterval,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
        },
      })
      .from(subscriptions)
      .leftJoin(categories, eq(subscriptions.categoryId, categories.id))
      .where(eq(subscriptions.userId, userId));

    return rows.map((subscription) => ({
      ...subscription,
      category:
        subscription.category?.id == null
          ? null
          : {
              id: subscription.category.id,
              name: subscription.category.name,
              icon: subscription.category.icon,
            },
    }));
  }

  async calculateStats(userId: string) {
    const rows = await this.db
      .select({
        price: subscriptions.price,
        billingInterval: subscriptions.billingInterval,
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    const monthlyCost = rows.reduce(
      (sum, s) => sum + toMonthlyCost(s.price, s.billingInterval ?? "monthly"),
      0,
    );

    return {
      averagePerSub: rows.length === 0 ? 0 : monthlyCost / rows.length,
      dailyCost: monthlyCost / 30,
    };
  }

  async calculateMonthlyCosts(userId: string) {
    const rows = await this.findAll(userId);

    return rows.map((subscription) => ({
      id: subscription.id,
      name: subscription.name,
      price: subscription.price,
      billingInterval: subscription.billingInterval,
      monthlyPrice: normalizeMonthlyPrice(
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
      })
      .from(categories)
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)));
  }

  async create(
    userId: string,
    input: {
      name: string;
      price: number;
      billingInterval: string;
      categoryId: number | null;
    },
  ) {
    let categoryId: number | null = null;

    if (input.categoryId !== null) {
      const [category] = await this.findCategoryById(userId, input.categoryId);

      if (!category) {
        throw new Error("Invalid category");
      }

      categoryId = category.id;
    }

    const [subscription] = await this.db
      .insert(subscriptions)
      .values({
        userId,
        name: input.name,
        price: input.price,
        billingInterval: input.billingInterval as
          | "monthly"
          | "weekly"
          | "yearly",
        categoryId,
      })
      .returning({
        id: subscriptions.id,
        name: subscriptions.name,
        price: subscriptions.price,
        billingInterval: subscriptions.billingInterval,
        categoryId: subscriptions.categoryId,
      });

    if (!subscription) {
      throw new Error("Failed to create subscription");
    }

    if (subscription.categoryId == null) {
      return {
        id: subscription.id,
        name: subscription.name,
        price: subscription.price,
        billingInterval: subscription.billingInterval,
        category: null,
      };
    }

    const [category] = await this.findCategoryById(
      userId,
      subscription.categoryId,
    );

    return {
      id: subscription.id,
      name: subscription.name,
      price: subscription.price,
      billingInterval: subscription.billingInterval,
      category: category ?? null,
    };
  }

  async update(
    userId: string,
    input: {
      id: number;
      name: string;
      price: number;
      billingInterval: string;
      categoryId: number | null;
    },
  ) {
    let categoryId: number | null = null;

    if (input.categoryId !== null) {
      const [category] = await this.findCategoryById(userId, input.categoryId);

      if (!category) {
        throw new Error("Invalid category");
      }

      categoryId = category.id;
    }

    const result = await this.db
      .update(subscriptions)
      .set({
        name: input.name,
        price: input.price,
        billingInterval: input.billingInterval as
          | "monthly"
          | "weekly"
          | "yearly",
        categoryId,
      })
      .where(
        and(eq(subscriptions.id, input.id), eq(subscriptions.userId, userId)),
      )
      .returning({
        id: subscriptions.id,
        name: subscriptions.name,
        price: subscriptions.price,
        billingInterval: subscriptions.billingInterval,
        categoryId: subscriptions.categoryId,
      });

    if (result.length === 0) {
      throw new Error("Subscription not found");
    }

    const subscription = result[0];

    if (subscription.categoryId == null) {
      return {
        id: subscription.id,
        name: subscription.name,
        price: subscription.price,
        billingInterval: subscription.billingInterval,
        category: null,
      };
    }

    const [category] = await this.findCategoryById(
      userId,
      subscription.categoryId,
    );

    return {
      id: subscription.id,
      name: subscription.name,
      price: subscription.price,
      billingInterval: subscription.billingInterval,
      category: category ?? null,
    };
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
