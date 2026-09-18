import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { getDb } from "#/db";
import * as schema from "#/db/schema";
import { getRequestResource, isCloudflareWorkers } from "#/lib/request-store";

type Auth = ReturnType<typeof betterAuth>;

function createAuth(): Auth {
  const baseURL =
    process.env.BETTER_AUTH_URL ??
    (process.env.NODE_ENV === "production"
      ? (() => {
          throw new Error("BETTER_AUTH_URL must be set in production");
        })()
      : "http://localhost:3000");

  return betterAuth({
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    baseURL,
    plugins: [tanstackStartCookies()],
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
