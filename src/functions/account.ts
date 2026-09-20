import { createServerFn } from "@tanstack/react-start";

import { getDb } from "#/db";
import { ensureSession } from "#/lib/auth.functions";
import { dataExportSchema } from "#/schemas";
import { CategoryService } from "#/services/categories";
import { SubscriptionService } from "#/services/subscriptions";

export const exportAccountData = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    // Created per request: on Workers, env vars and connections only exist
    // within the request lifecycle.
    const subService = new SubscriptionService(getDb());
    const catService = new CategoryService(getDb());
    const [entries, categories] = await Promise.all([
      subService.findAllForExport(user.id),
      catService.findAll(user.id),
    ]);
    return dataExportSchema.parse({
      version: "2.0",
      entries,
      categories,
      exportedAt: new Date().toISOString(),
    });
  },
);

export const importAccountData = createServerFn({
  method: "POST",
})
  .inputValidator(dataExportSchema)
  .handler(async ({ data }) => {
    const { user } = await ensureSession();
    const catService = new CategoryService(getDb());
    const subService = new SubscriptionService(getDb());
    const newCategories = await catService.bulkCreate(user.id, data.categories);

    const oldToNewId = new Map<number, number>();
    for (let i = 0; i < data.categories.length; i++) {
      oldToNewId.set(data.categories[i].id, newCategories[i].id);
    }

    const subscriptions = data.entries.map((sub) => ({
      name: sub.name,
      price: sub.price,
      billingInterval: sub.billingInterval,
      notes: sub.notes,
      isActive: sub.isActive,
      nextBillingDate: sub.nextBillingDate,
      categoryId:
        sub.categoryId !== null
          ? (oldToNewId.get(sub.categoryId) ?? null)
          : null,
    }));

    const newSubscriptions = await subService.bulkCreate(
      user.id,
      subscriptions,
    );

    return {
      importedCategories: newCategories.length,
      importedSubscriptions: newSubscriptions.length,
    };
  });
