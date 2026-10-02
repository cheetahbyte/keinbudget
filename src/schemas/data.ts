import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { subscriptions } from "#/db/schema/subscriptions";

import { categorySchema } from "./category";

export const accountEntrySchema = createSelectSchema(subscriptions, {
  notes: z.string().default(""),
  isActive: z.boolean().default(true),
  nextBillingDate: z.iso.date().nullable().default(null),
}).omit({ userId: true });

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
