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
      subService.findAll(user.id),
      catService.findAll(user.id),
    ]);
    return { version: "1.0", subscriptions, categories };
  },
);

// TODO
export const importAccountData = createServerFn({
  method: "POST",
})
  .inputValidator(dataExportSchema)
  .handler(async ({ data }) => {
    const { user } = await ensureSession();
    if (data.version === "1.0") {
      const [subscriptions, categories] = await Promise.all([
        catService.bulkCreate(user.id, data.categories),
        subService.bulkCreate(user.id, data.subscriptions),
      ]);
    }
  });
