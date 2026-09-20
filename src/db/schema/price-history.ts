import { integer, pgTable, real, serial, timestamp } from "drizzle-orm/pg-core";

import { subscriptions } from "./subscriptions";

export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscriptionId")
    .notNull()
    .references(() => subscriptions.id, { onDelete: "cascade" }),
  price: real("price").notNull(),
  changedAt: timestamp("changedAt", { mode: "date" }).notNull().defaultNow(),
});
