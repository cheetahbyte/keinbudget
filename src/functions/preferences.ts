import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { getDb } from "#/db";
import { getAuth } from "#/lib/auth";
import { ensureSession } from "#/lib/auth.functions";
import { DEFAULT_PREFERENCES } from "#/lib/locale";
import { preferencesSchema } from "#/schemas";
import { PreferencesService } from "#/services/preferences";

// Signed-out visitors get defaults so the root layout can always provide them.
export const getPreferences = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getAuth().api.getSession({
      headers: getRequestHeaders(),
    });
    if (!session) return DEFAULT_PREFERENCES;
    const service = new PreferencesService(getDb());
    return service.find(session.user.id);
  },
);

export const updatePreferences = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => preferencesSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    const service = new PreferencesService(getDb());
    return service.upsert(user.id, ctx.data);
  });
