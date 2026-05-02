import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { categories } from "./categories";

export const billingIntervalEnum = ["monthly", "weekly", "yearly"] as const;

export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  billingInterval: text("billingInterval", { enum: billingIntervalEnum }).notNull().default("monthly"),
  categoryId: integer("categoryId").references(() => categories.id, { onDelete: "set null" }),
});
