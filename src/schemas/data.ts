import { z } from "zod";
import { categorySchema } from "./category";
import { subscriptionSchema } from "./subscription";

export const dataExportSchema = z.object({
  subscriptions: z.array(subscriptionSchema),
  categories: z.array(categorySchema),
});

export type DataExport = z.infer<typeof dataExportSchema>;
