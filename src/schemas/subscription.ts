import { z } from "zod";

import type { BillingInterval } from "#/lib/billing-interval";
import { BILLING_INTERVALS } from "#/lib/billing-interval";

import { categorySchema } from "./category";
import type { entityIdSchema } from "./rest";

export type { BillingInterval };

export const billingIntervalSchema = z.enum(BILLING_INTERVALS);

export const priceChangeSchema = z.object({
  price: z.number(),
  changedAt: z.iso.datetime(),
});

const entryFieldsSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  billingInterval: billingIntervalSchema,
  categoryId: z.number().int().positive().nullable(),
  notes: z.string().max(2000).default(""),
  isActive: z.boolean().default(true),
  nextBillingDate: z.iso.date().nullable().default(null),
});

export const subscriptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  billingInterval: billingIntervalSchema,
  category: categorySchema.nullable(),
  notes: z.string(),
  isActive: z.boolean(),
  nextBillingDate: z.iso.date().nullable(),
  priceHistory: z.array(priceChangeSchema),
});

export const monthlyProjectionsSchema = z.object({
  income: z.number(),
  expenses: z.number(),
  savings: z.number(),
  remaining: z.number(),
});

export const monthlyCostSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  billingInterval: billingIntervalSchema,
  monthlyPrice: z.number(),
});

export const createSubscriptionSchema = entryFieldsSchema;

export const updateSubscriptionSchema = entryFieldsSchema.extend({
  id: z.number().int().positive(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;
export type PriceChange = z.infer<typeof priceChangeSchema>;
export type MonthlyProjections = z.infer<typeof monthlyProjectionsSchema>;
export type MonthlyCost = z.infer<typeof monthlyCostSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type RemoveSubscriptionInput = z.infer<typeof entityIdSchema>;
