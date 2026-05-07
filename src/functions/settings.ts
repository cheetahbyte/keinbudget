import { createServerFn } from "@tanstack/react-start";
import { db } from "#/db";
import { ensureSession } from "#/lib/auth.functions";
import { updatePreferencesSchema } from "#/schemas/settings";
import { SettingsService } from "#/services/settings";

const service = new SettingsService(db);

export const getSettings = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    return (await service.findForUser(user.id)) ?? null;
  },
);

export const updateSettings = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => updatePreferencesSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    return service.update(user.id, ctx.data);
  });
