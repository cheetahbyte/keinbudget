import { and, desc, eq, isNull } from "drizzle-orm";

import type { DrizzleClient } from "#/db";
import {
  oauthAccessToken,
  oauthClient,
  oauthConsent,
  oauthRefreshToken,
} from "#/db";

export interface ConnectedApp {
  id: string;
  clientId: string;
  name: string | null;
  uri: string | null;
  scopes: string[];
  grantedAt: string | null;
  updatedAt: string | null;
}

export class ConnectedAppsService {
  constructor(private readonly db: DrizzleClient) {}

  async list(userId: string): Promise<ConnectedApp[]> {
    const rows = await this.db
      .select({
        id: oauthConsent.id,
        clientId: oauthConsent.clientId,
        scopes: oauthConsent.scopes,
        createdAt: oauthConsent.createdAt,
        updatedAt: oauthConsent.updatedAt,
        name: oauthClient.name,
        uri: oauthClient.uri,
      })
      .from(oauthConsent)
      .leftJoin(oauthClient, eq(oauthConsent.clientId, oauthClient.clientId))
      .where(eq(oauthConsent.userId, userId))
      .orderBy(desc(oauthConsent.updatedAt));

    return rows.map((row) => ({
      id: row.id,
      clientId: row.clientId,
      name: row.name ?? null,
      uri: row.uri ?? null,
      scopes: row.scopes,
      grantedAt: row.createdAt?.toISOString() ?? null,
      updatedAt: row.updatedAt?.toISOString() ?? null,
    }));
  }

  async hasConsent(userId: string, clientId: string): Promise<boolean> {
    const [row] = await this.db
      .select({ id: oauthConsent.id })
      .from(oauthConsent)
      .where(
        and(
          eq(oauthConsent.userId, userId),
          eq(oauthConsent.clientId, clientId),
        ),
      )
      .limit(1);
    return row !== undefined;
  }

  // Deletes the consent and revokes every refresh and opaque access token the
  // client holds for this user. Outstanding JWT access tokens expire on their
  // own within MCP_ACCESS_TOKEN_TTL_SECONDS and are rejected by the consent
  // check in the MCP route before that.
  async revoke(userId: string, consentId: string) {
    const [consent] = await this.db
      .select({ clientId: oauthConsent.clientId })
      .from(oauthConsent)
      .where(
        and(eq(oauthConsent.id, consentId), eq(oauthConsent.userId, userId)),
      );
    if (!consent) throw new Error("Connected app not found");

    const now = new Date();
    const byClient = (
      table: typeof oauthRefreshToken | typeof oauthAccessToken,
    ) =>
      and(
        eq(table.userId, userId),
        eq(table.clientId, consent.clientId),
        isNull(table.revoked),
      );
    await this.db
      .update(oauthAccessToken)
      .set({ revoked: now })
      .where(byClient(oauthAccessToken));
    await this.db
      .update(oauthRefreshToken)
      .set({ revoked: now })
      .where(byClient(oauthRefreshToken));
    await this.db
      .delete(oauthConsent)
      .where(
        and(
          eq(oauthConsent.userId, userId),
          eq(oauthConsent.clientId, consent.clientId),
        ),
      );

    return { success: true as const };
  }
}
