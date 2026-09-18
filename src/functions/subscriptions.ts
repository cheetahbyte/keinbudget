import { createServerFn } from "@tanstack/react-start";

import { getDb } from "#/db";
import { ensureSession } from "#/lib/auth.functions";
import {
  createSubscriptionSchema,
  entityIdSchema,
  updateSubscriptionSchema,
} from "#/schemas";
import { SubscriptionService } from "#/services/subscriptions";

export const getSubscriptions = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    // Created per request: on Workers, env vars and connections only exist
    // within the request lifecycle.
    const service = new SubscriptionService(getDb());
    return service.findAll(user.id);
  },
);

export const getMonthlyProjections = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    const service = new SubscriptionService(getDb());
    return service.calculateMonthlyProjections(user.id);
  },
);

export const getMonthlyCosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    const service = new SubscriptionService(getDb());
    return service.calculateMonthlyCosts(user.id);
  },
);

export const createSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSubscriptionSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    const service = new SubscriptionService(getDb());
    return service.create(user.id, ctx.data);
  });

export const updateSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => updateSubscriptionSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    const service = new SubscriptionService(getDb());
    return service.update(user.id, ctx.data);
  });

export const deleteSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => entityIdSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    const service = new SubscriptionService(getDb());
    return service.remove(user.id, ctx.data.id);
  });
