import { oc } from "@orpc/contract";
import { z } from "zod";
import { categorySchema } from "./category";

const billingIntervalSchema = z.enum(["monthly", "weekly", "yearly"]);

const subscriptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  billingInterval: billingIntervalSchema,
  category: categorySchema.nullable(),
});

export const subscriptionContract = {
  all: oc.route({ method: "GET", path: "/subscriptions" }).output(z.array(subscriptionSchema)),
  monthlyCosts: oc.route({ method: "GET", path: "/subscriptions/monthly-costs" }).output(
    z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        price: z.number(),
        billingInterval: billingIntervalSchema,
        monthlyPrice: z.number(),
      })
    )
  ),
  stats: oc.route({ method: "GET", path: "/subscriptions/stats" }).output(
    z.object({ averagePerSub: z.number(), dailyCost: z.number() })
  ),
  create: oc
    .route({ method: "POST", path: "/subscriptions" })
    .input(
      z.object({
        name: z.string().min(1),
        price: z.number().positive(),
        billingInterval: billingIntervalSchema,
        categoryId: z.number().int().positive().nullable(),
      })
    )
    .output(subscriptionSchema),
  remove: oc
    .route({ method: "DELETE", path: "/subscriptions/{id}" })
    .input(z.object({ id: z.number().int().positive() }))
    .output(z.object({ success: z.literal(true) })),
};
