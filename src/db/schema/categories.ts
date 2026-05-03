import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
});
