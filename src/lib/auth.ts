import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "#/db";
import * as schema from "#/db/schema";

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error("BETTER_AUTH_URL must be set in production");
      })()
    : "http://localhost:3000");

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
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
