import { categories, db, subscriptions } from "@keinbudget/db";
import { and, eq } from "drizzle-orm";
import { injectable } from "tsyringe";
import type { CreateSubscriptionInput } from "./subcriptions.types";

@injectable()
export class SubscriptionRepo {
  findAll(userId: string) {
    return db
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
  }

  calculateStats(userId: string) {
    return db
      .select({ price: subscriptions.price, billingInterval: subscriptions.billingInterval })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
  }

  findCategoryById(userId: string, categoryId: number) {
    return db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
      })
      .from(categories)
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)));
  }

  async create(userId: string, input: CreateSubscriptionInput) {
    let categoryId: number | null = null;

    if (input.categoryId !== null) {
      const [category] = await this.findCategoryById(userId, input.categoryId);

      if (!category) {
        throw new Error("Invalid category");
      }

      categoryId = category.id;
    }

    const [subscription] = await db
      .insert(subscriptions)
      .values({
        userId,
        name: input.name,
        price: input.price,
        billingInterval: input.billingInterval,
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

    const [category] = await this.findCategoryById(userId, subscription.categoryId);

    return {
      id: subscription.id,
      name: subscription.name,
      price: subscription.price,
      billingInterval: subscription.billingInterval,
      category: category ?? null,
    };
  }

  async remove(userId: string, id: number) {
    const result = await db
      .delete(subscriptions)
      .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
      .returning({ id: subscriptions.id });

    if (result.length === 0) {
      throw new Error("Subscription not found");
    }

    return { success: true as const };
  }
}
