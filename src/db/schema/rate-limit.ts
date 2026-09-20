import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core";

// Better Auth rate limiting with `storage: "database"`; Workers isolates
// cannot share the default in-memory counters.
export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});
