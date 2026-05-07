import { char, doublePrecision, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const preferences = pgTable("preferences", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  currency: char("currency", { length: 3 }).notNull().default("EUR"),
  locale: char("locale", { length: 5 }).notNull().default("en-US"),
  comparisonItemName: text("comparisonItemName").notNull().default("burger"),
  comparisonItemPrice: doublePrecision("comparisonItemPrice").notNull().default(8),
});
