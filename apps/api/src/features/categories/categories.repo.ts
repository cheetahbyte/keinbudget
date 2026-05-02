import { categories, db } from "@keinbudget/db";
import { and, eq } from "drizzle-orm";
import { injectable } from "tsyringe";
import type { CreateCategoryInput } from "./categories.types";

@injectable()
export class CategoryRepo {
  findAll(userId: string) {
    return db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
      })
      .from(categories)
      .where(eq(categories.userId, userId));
  }

  async create(userId: string, input: CreateCategoryInput) {
    const [category] = await db
      .insert(categories)
      .values({
        userId,
        name: input.name,
        icon: input.icon,
      })
      .returning({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
      });

    if (!category) {
      throw new Error("Failed to create category");
    }

    return category;
  }

  async remove(userId: string, id: number) {
    const result = await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning({ id: categories.id });

    if (result.length === 0) {
      throw new Error("Category not found");
    }

    return { success: true as const };
  }
}
