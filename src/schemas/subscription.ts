import { z } from "zod";
import type { BillingInterval } from "#/lib/billing-interval";
import { BILLING_INTERVALS } from "#/lib/billing-interval";
import { categorySchema } from "./category";
import type { entityIdSchema } from "./rest";

export type { BillingInterval };

export const billingIntervalSchema = z.enum(BILLING_INTERVALS);

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

export const updateSubscriptionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().positive(),
  billingInterval: billingIntervalSchema,
  categoryId: z.number().int().positive().nullable(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;
export type SubscriptionStats = z.infer<typeof subscriptionStatsSchema>;
export type MonthlyCost = z.infer<typeof monthlyCostSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type RemoveSubscriptionInput = z.infer<typeof entityIdSchema>;
