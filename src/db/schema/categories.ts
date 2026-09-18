import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

import { CATEGORY_TYPES } from "#/lib/category-type";

import { user } from "./auth";

export const categoryType = pgEnum("category_type", CATEGORY_TYPES);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  type: categoryType("type").notNull().default("expense"),
});
