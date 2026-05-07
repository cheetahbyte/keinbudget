import { z } from "zod";

export const preferencesSchema = z.object({
  id: z.string(),
  userId: z.string(),
  currency: z.string().length(3),
  locale: z.string().length(5),
  comparisonItemName: z.string(),
  comparisonItemPrice: z.number().positive(),
});

export const updatePreferencesSchema = z.object({
  currency: z.string().length(3, "Currency must be a 3-letter ISO code"),
  comparisonItemName: z.string().min(1, "Name is required"),
  comparisonItemPrice: z.number().positive("Price must be positive"),
});
