import { and, eq } from "drizzle-orm";
import type { DB } from "#/db";
import { categories } from "#/db";

export class CategoryService {
  constructor(private readonly db: DB) {}

  findAll(userId: string) {
    return this.db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
      })
      .from(categories)
      .where(eq(categories.userId, userId));
  }

  async create(userId: string, input: { name: string; icon: string }) {
    const [category] = await this.db
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
