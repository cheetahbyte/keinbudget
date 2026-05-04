import { createServerFn } from "@tanstack/react-start";
import { db } from "#/db";
import { ensureSession } from "#/lib/auth.functions";
import { CategoryService } from "#/services/categories";
import { SubscriptionService } from "#/services/subscriptions";

const subService = new SubscriptionService(db);
const catService = new CategoryService(db);

export const exportAccountData = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    const [subscriptions, categories] = await Promise.all([
      subService.findAll(user.id),
      catService.findAll(user.id),
    ]);
    return { subscriptions, categories };
  },
);
