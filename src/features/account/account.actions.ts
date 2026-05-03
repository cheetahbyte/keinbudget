import { createServerFn } from "@tanstack/react-start";
import { requireSession } from "#/server/auth/session";
import { CategoryRepo } from "../categories/categories.repo";
import { CategoryService } from "../categories/categories.service";
import { SubscriptionRepo } from "../subscriptions/subscriptions.repo";
import { SubscriptionService } from "../subscriptions/subscriptions.service";

const subService = new SubscriptionService(new SubscriptionRepo());
const catService = new CategoryService(new CategoryRepo());

export const exportAccountData = createServerFn({ method: "GET" }).handler(async () => {
  const { user } = await requireSession();
  const [subscriptions, categories] = await Promise.all([
    subService.findAll(user.id),
    catService.findAll(user.id),
  ]);
  return { subscriptions, categories };
});
