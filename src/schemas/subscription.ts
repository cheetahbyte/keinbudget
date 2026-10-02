import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { priceHistory } from "#/db/schema/price-history";
import { billingInterval, subscriptions } from "#/db/schema/subscriptions";
import type { BillingInterval } from "#/lib/billing-interval";

import { categorySchema } from "./category";
import type { entityIdSchema } from "./rest";

export type { BillingInterval };

export const billingIntervalSchema = createSelectSchema(billingInterval);

export const priceChangeSchema = createSelectSchema(priceHistory, {
  changedAt: z.iso.datetime(),
}).pick({ price: true, changedAt: true });

const entryFieldsSchema = createInsertSchema(subscriptions, {
  name: (schema) => schema.min(1),
  price: (schema) => schema.positive(),
  billingInterval: billingIntervalSchema,
  categoryId: z.number().int().positive().nullable(),
  notes: z.string().max(2000).default(""),
  isActive: z.boolean().default(true),
  nextBillingDate: z.iso.date().nullable().default(null),
}).omit({ id: true, userId: true });

const subscriptionRowSchema = createSelectSchema(subscriptions, {
  nextBillingDate: z.iso.date().nullable(),
});

export const subscriptionSchema = subscriptionRowSchema
  .omit({ userId: true, categoryId: true })
  .extend({
    category: categorySchema.nullable(),
    priceHistory: z.array(priceChangeSchema),
  });

export const monthlyProjectionsSchema = z.object({
  income: z.number(),
  expenses: z.number(),
  savings: z.number(),
  remaining: z.number(),
});

export const monthlyCostSchema = subscriptionRowSchema
  .pick({ id: true, name: true, price: true, billingInterval: true })
  .extend({ monthlyPrice: z.number() });

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
