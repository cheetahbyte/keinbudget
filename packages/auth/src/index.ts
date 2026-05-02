import { passkey } from "@better-auth/passkey";
import { db } from "@keinbudget/db";
import * as schema from "@keinbudget/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  plugins: [
    passkey({
      rpID: "localhost",
      rpName: "keinbudget",
      registration: {
        requireSession: false,
        resolveUser: async ({ ctx, context }) => {
          return { id: "user-id", name: "user@example.com" };
        },
        extensions: { credProps: true },
      },
      authentication: {
        extensions: { credProps: true },
      },
    }),
  ],
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:4000",
    "https://example.com",
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
