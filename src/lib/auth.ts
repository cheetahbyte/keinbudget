import { cimd } from "@better-auth/cimd";
import { fetchClientMetadataResource } from "@better-auth/cimd/node";
import { mcp } from "@better-auth/mcp";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { getDb } from "#/db";
import * as schema from "#/db/schema";
import {
  createWorkersMetadataFetch,
  metadataUrlPolicy,
} from "#/lib/cimd-fetch";
import {
  MCP_ACCESS_TOKEN_TTL_SECONDS,
  MCP_PATH,
  MCP_REFRESH_TOKEN_TTL_SECONDS,
  MCP_SCOPES,
} from "#/lib/mcp-scopes";
import { getRequestResource, isCloudflareWorkers } from "#/lib/request-store";

export function getBaseURL(): string {
  return (
    process.env.BETTER_AUTH_URL ??
    (process.env.NODE_ENV === "production"
      ? (() => {
          throw new Error("BETTER_AUTH_URL must be set in production");
        })()
      : "http://localhost:3000")
  );
}

export function getMcpResource(): string {
  return `${getBaseURL()}${MCP_PATH}`;
}

// Node pins DNS answers at the socket. Workers rely on the runtime plus the
// global_fetch_strictly_public flag (see wrangler.toml) and a bounded fetch.
const workersMetadataFetch = createWorkersMetadataFetch();
const clientMetadataFetch: typeof fetchClientMetadataResource = (
  input,
  init,
) =>
  isCloudflareWorkers()
    ? workersMetadataFetch(input, init)
    : fetchClientMetadataResource(input, init);

function createAuth() {
  const baseURL = getBaseURL();
  const { hostname } = new URL(baseURL);
  const resource = getMcpResource();

  return betterAuth({
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    baseURL,
    rateLimit: {
      enabled: true,
      storage: "database",
    },
    plugins: [
      tanstackStartCookies(),
      passkey({
        rpID: hostname,
        rpName: "keinbudget",
        origin: baseURL,
        authenticatorSelection: { userVerification: "required" },
      }),
      jwt(),
      mcp({
        loginPage: "/login",
        consentPage: "/consent",
        resource,
        scopes: [...MCP_SCOPES],
        accessTokenExpiresIn: MCP_ACCESS_TOKEN_TTL_SECONDS,
        refreshTokenExpiresIn: MCP_REFRESH_TOKEN_TTL_SECONDS,
        clientRegistrationAllowedScopes: [...MCP_SCOPES],
        clientRegistrationRequirePKCE: true,
        resources: [
          {
            identifier: resource,
            name: "keinbudget MCP",
            accessTokenTtl: MCP_ACCESS_TOKEN_TTL_SECONDS,
            refreshTokenTtl: MCP_REFRESH_TOKEN_TTL_SECONDS,
            allowedScopes: [...MCP_SCOPES],
          },
        ],
      }),
      cimd({
        fetchClientMetadataResource: clientMetadataFetch,
        metadataProfile: "mcp-2026-07-28",
        isMetadataDocumentUrlAllowed: (clientIdUrl) =>
          metadataUrlPolicy(clientIdUrl) !== null,
      }),
    ],
    emailAndPassword: {
      enabled: true,
      disableSignUp: process.env.DISABLE_SIGNUP === "true",
    },
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    trustedOrigins: [baseURL],
  });
}

type Auth = ReturnType<typeof createAuth>;

// On Cloudflare Workers the auth instance is created per request (keyed by
// the request context) because env vars and the DB client only exist within
// the request lifecycle. On Node one instance per process is shared, as
// before.
let nodeAuth: Auth | undefined;

export function getAuth(): Auth {
  if (isCloudflareWorkers()) {
    return getRequestResource("auth", createAuth);
  }

  if (!nodeAuth) {
    nodeAuth = createAuth();
  }

  return nodeAuth;
}
