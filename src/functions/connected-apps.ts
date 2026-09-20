import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, oauthClient } from "#/db";
import { ensureSession } from "#/lib/auth.functions";
import { ConnectedAppsService } from "#/services/connected-apps";

export const getConnectedApps = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    return new ConnectedAppsService(getDb()).list(user.id);
  },
);

export const revokeConnectedApp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().min(1) }).parse(input),
  )
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    return new ConnectedAppsService(getDb()).revoke(user.id, ctx.data.id);
  });

// Public client metadata shown on the consent page so users see the verified
// registration, not only the raw client_id.
export const getOAuthClientInfo = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ clientId: z.string() }).parse(input),
  )
  .handler(async (ctx) => {
    await ensureSession();
    if (!ctx.data.clientId) return null;
    const [client] = await getDb()
      .select({
        clientId: oauthClient.clientId,
        name: oauthClient.name,
        uri: oauthClient.uri,
        redirectUris: oauthClient.redirectUris,
      })
      .from(oauthClient)
      .where(eq(oauthClient.clientId, ctx.data.clientId));
    return client ?? null;
  });
