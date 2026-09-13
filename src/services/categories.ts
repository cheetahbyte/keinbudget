import { and, eq } from "drizzle-orm";
import type { DrizzleClient } from "#/db";
import { categories } from "#/db";
import type { CategoryType } from "#/lib/category-type";
import type { Category } from "#/schemas";

export class CategoryService {
  constructor(private readonly db: DrizzleClient) {}

  findAll(userId: string) {
    return this.db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        type: categories.type,
      })
      .from(categories)
      .where(eq(categories.userId, userId));
  }

  async bulkCreate(userId: string, input: Category[]) {
    if (input.length === 0) return [];
    const rows = await this.db
      .insert(categories)
      .values(
        input.map((c) => ({
          userId,
          name: c.name,
          icon: c.icon,
          type: c.type,
        })),
      )
      .returning({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        type: categories.type,
      });
    return rows;
  }

  async create(
    userId: string,
    input: { name: string; icon: string; type: CategoryType },
  ) {
    const [category] = await this.db
      .insert(categories)
      .values({
        userId,
        name: input.name,
        icon: input.icon,
        type: input.type,
      })
      .returning({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        type: categories.type,
      });

    if (!category) {
      throw new Error("Failed to create category");
    }

    return category;
  }

  async update(
    userId: string,
    input: { id: number; name: string; icon: string; type: CategoryType },
  ) {
    const result = await this.db
      .update(categories)
      .set({ name: input.name, icon: input.icon, type: input.type })
      .where(and(eq(categories.id, input.id), eq(categories.userId, userId)))
      .returning({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        type: categories.type,
      });

    if (result.length === 0) {
      throw new Error("Category not found");
    }

    return result[0];
  }

  async remove(userId: string, id: number) {
    const result = await this.db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning({ id: categories.id });

    if (result.length === 0) {
      throw new Error("Category not found");
    }

    return { success: true as const };
  }
}
