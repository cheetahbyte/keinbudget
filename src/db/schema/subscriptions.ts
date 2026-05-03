import {
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { categories } from "./categories";

export const billingIntervalEnum = ["monthly", "weekly", "yearly"] as const;
export const billingInterval = pgEnum("billing_interval", billingIntervalEnum);

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  billingInterval: billingInterval("billingInterval")
    .notNull()
    .default("monthly"),
  categoryId: integer("categoryId").references(() => categories.id, {
    onDelete: "set null",
  }),
});
