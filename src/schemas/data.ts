import { z } from "zod";

import { categorySchema, categoryTypeSchema } from "./category";
import { billingIntervalSchema } from "./subscription";

// Old exports have no `type` on categories; default them to "expense".
const exportCategorySchema = categorySchema.extend({
  type: categoryTypeSchema.default("expense"),
});

export const accountSubscriptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  billingInterval: billingIntervalSchema,
  categoryId: z.number().nullable(),
});

export const dataExportV1Schema = z
  .object({
    version: z.literal("1.0"),
    subscriptions: z.array(accountSubscriptionSchema).default([]),
    categories: z.array(exportCategorySchema).default([]),
    exportedAt: z.iso.datetime().optional(),
  })
  .strict();

export const dataExportSchema = z.discriminatedUnion("version", [
  dataExportV1Schema,
]);

export type AccountSubscription = z.infer<typeof accountSubscriptionSchema>;
export type DataExport = z.infer<typeof dataExportSchema>;
export type DataExportV1 = z.infer<typeof dataExportV1Schema>;
