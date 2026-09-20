import { z } from "zod";

import { categorySchema } from "./category";
import { billingIntervalSchema } from "./subscription";

export const accountEntrySchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  billingInterval: billingIntervalSchema,
  categoryId: z.number().nullable(),
  notes: z.string().default(""),
  isActive: z.boolean().default(true),
  nextBillingDate: z.iso.date().nullable().default(null),
});

export const dataExportSchema = z
  .object({
    version: z.literal("2.0"),
    entries: z.array(accountEntrySchema),
    categories: z.array(categorySchema),
    exportedAt: z.iso.datetime().optional(),
  })
  .strict();

export type AccountEntry = z.infer<typeof accountEntrySchema>;
export type DataExport = z.infer<typeof dataExportSchema>;
