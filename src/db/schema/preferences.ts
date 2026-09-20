import { pgTable, text } from "drizzle-orm/pg-core";

import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "#/lib/locale";

import { user } from "./auth";

export const userPreferences = pgTable("user_preferences", {
  userId: text("userId")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  locale: text("locale").notNull().default(DEFAULT_LOCALE),
  currency: text("currency").notNull().default(DEFAULT_CURRENCY),
});
