import { z } from "zod";
import { categorySchema } from "./category";
import { billingIntervalSchema } from "./subscription";

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
    categories: z.array(categorySchema).default([]),
    exportedAt: z.iso.datetime().optional(),
  })
  .strict();

export const dataExportSchema = z.discriminatedUnion("version", [
  dataExportV1Schema,
]);

export type AccountSubscription = z.infer<typeof accountSubscriptionSchema>;
export type DataExport = z.infer<typeof dataExportSchema>;
export type DataExportV1 = z.infer<typeof dataExportV1Schema>;
