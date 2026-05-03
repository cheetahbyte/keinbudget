import { createServerFn } from "@tanstack/react-start";
import { createSubscriptionSchema, entityIdSchema } from "#/schemas";
import { requireSession } from "#/server/auth/session";
import { SubscriptionRepo } from "./subscriptions.repo";
import { SubscriptionService } from "./subscriptions.service";

const repo = new SubscriptionRepo();
const service = new SubscriptionService(repo);

export const getSubscriptions = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await requireSession();
    return service.findAll(user.id);
  },
);

export const getSubscriptionStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await requireSession();
    return service.calculateStats(user.id);
  },
);

export const getMonthlyCosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await requireSession();
    return service.calculateMonthlyCosts(user.id);
  },
);

export const createSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSubscriptionSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await requireSession();
    return service.create(user.id, ctx.data);
  });

export const deleteSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => entityIdSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await requireSession();
    return service.remove(user.id, ctx.data.id);
  });
