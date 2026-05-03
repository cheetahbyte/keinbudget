import { z } from "zod";
import { entityIdSchema } from "./rest";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
});

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type RemoveCategoryInput = z.infer<typeof entityIdSchema>;
