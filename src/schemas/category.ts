import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { categories, categoryType } from "#/db/schema/categories";

import type { entityIdSchema } from "./rest";

export const categoryTypeSchema = createSelectSchema(categoryType);

export const categorySchema = createSelectSchema(categories).omit({
  userId: true,
});

export const createCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.min(1),
  icon: (schema) => schema.min(1),
  type: categoryTypeSchema,
}).pick({ name: true, icon: true, type: true });

export const updateCategorySchema = createCategorySchema.extend({
  id: z.number().int().positive(),
});

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type RemoveCategoryInput = z.infer<typeof entityIdSchema>;
