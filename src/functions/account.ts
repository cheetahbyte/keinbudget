import { createServerFn } from "@tanstack/react-start";
import { db } from "#/db";
import { ensureSession } from "#/lib/auth.functions";
import { dataExportSchema } from "#/schemas";
import { CategoryService } from "#/services/categories";
import { SubscriptionService } from "#/services/subscriptions";

const subService = new SubscriptionService(db);
const catService = new CategoryService(db);

export const exportAccountData = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    const [subscriptions, categories] = await Promise.all([
      subService.findAllForExport(user.id),
      catService.findAll(user.id),
    ]);
    return { version: "1.0", subscriptions, categories };
  },
);

export const importAccountData = createServerFn({
  method: "POST",
})
  .inputValidator(dataExportSchema)
  .handler(async ({ data }) => {
    const { user } = await ensureSession();
    if (data.version === "1.0") {
      const newCategories = await catService.bulkCreate(
        user.id,
        data.categories,
      );

      const oldToNewId = new Map<number, number>();
      for (let i = 0; i < data.categories.length; i++) {
        oldToNewId.set(data.categories[i].id, newCategories[i].id);
      }

      const subscriptions = data.subscriptions.map((sub) => ({
        name: sub.name,
        price: sub.price,
        billingInterval: sub.billingInterval,
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
    }
    return { importedCategories: 0, importedSubscriptions: 0 };
  });
