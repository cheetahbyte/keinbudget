import { requireMcpAuth } from "@better-auth/mcp";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { createFileRoute } from "@tanstack/react-router";

import { getDb } from "#/db";
import { getAuth, getMcpResource } from "#/lib/auth";
import { MCP_READ_SCOPE } from "#/lib/mcp-scopes";
import { createBudgetMcpServer } from "#/mcp/server";
import { ConnectedAppsService } from "#/services/connected-apps";

const mcpHandler = createMcpHandler(
  ({ authInfo }) =>
    createBudgetMcpServer(getDb(), {
      userId: String(authInfo?.extra?.userId ?? ""),
      scopes: new Set(authInfo?.scopes ?? []),
    }),
  { legacy: "stateless" },
);

const revokedResponse = () =>
  new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32001, message: "Access to this account was revoked" },
      id: null,
    }),
    {
      status: 401,
      headers: {
        "content-type": "application/json",
        "www-authenticate": 'Bearer error="invalid_token"',
      },
    },
  );

// Tokens are verified per request; the auth instance is resolved lazily so
// Workers get their request-scoped instance. JWTs stay valid until they
// expire, so the consent row is checked as well to honour revocation at once.
const handle = async ({ request }: { request: Request }) =>
  requireMcpAuth(
    getAuth(),
    async (req, claims) => {
      const userId = String(claims.sub ?? "");
      const clientId = String(claims.client_id ?? claims.azp ?? "");
      if (
        !userId ||
        !clientId ||
        !(await new ConnectedAppsService(getDb()).hasConsent(userId, clientId))
      ) {
        return revokedResponse();
      }
      return mcpHandler.fetch(req, {
        authInfo: {
          token: req.headers.get("authorization")?.slice(7) ?? "",
          clientId,
          scopes: String(claims.scope ?? "")
            .split(" ")
            .filter(Boolean),
          expiresAt: claims.exp,
          extra: { userId },
        },
      });
    },
    { resource: getMcpResource(), requiredScopes: [MCP_READ_SCOPE] },
  )(request);

export const Route = createFileRoute("/api/mcp")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      DELETE: handle,
    },
  },
});
