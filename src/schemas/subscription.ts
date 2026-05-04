import { z } from "zod";
import { categorySchema } from "./category";
import type { entityIdSchema } from "./rest";

export const billingIntervalSchema = z.enum(["monthly", "weekly", "yearly"]);

export const subscriptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  billingInterval: billingIntervalSchema,
  category: categorySchema.nullable(),
});

export const subscriptionStatsSchema = z.object({
  averagePerSub: z.number(),
  dailyCost: z.number(),
});

export const monthlyCostSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  billingInterval: billingIntervalSchema,
  monthlyPrice: z.number(),
});

export const createSubscriptionSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  billingInterval: billingIntervalSchema,
  categoryId: z.number().int().positive().nullable(),
});

export type BillingInterval = z.infer<typeof billingIntervalSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type SubscriptionStats = z.infer<typeof subscriptionStatsSchema>;
export type MonthlyCost = z.infer<typeof monthlyCostSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type RemoveSubscriptionInput = z.infer<typeof entityIdSchema>;
