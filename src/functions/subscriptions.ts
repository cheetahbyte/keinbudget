import { createServerFn } from "@tanstack/react-start";
import { db } from "#/db";
import { ensureSession } from "#/lib/auth.functions";
import {
  createSubscriptionSchema,
  entityIdSchema,
  updateSubscriptionSchema,
} from "#/schemas";
import { SubscriptionService } from "#/services/subscriptions";

const service = new SubscriptionService(db);

export const getSubscriptions = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    return service.findAll(user.id);
  },
);

export const getSubscriptionStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    return service.calculateStats(user.id);
  },
);

export const getMonthlyCosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    return service.calculateMonthlyCosts(user.id);
  },
);

export const createSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSubscriptionSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    return service.create(user.id, ctx.data);
  });

export const updateSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => updateSubscriptionSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    return service.update(user.id, ctx.data);
  });

export const deleteSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => entityIdSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    return service.remove(user.id, ctx.data.id);
  });
