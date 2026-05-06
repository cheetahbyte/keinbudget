import type { ExtractTablesWithRelations } from "drizzle-orm";
import type {
  PostgresJsDatabase,
  PostgresJsTransaction,
} from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set");
}

const sql = postgres(databaseUrl, {
  idle_timeout: 30,
  connect_timeout: 5,
});

export const db = drizzle(sql, { schema });
export type DB = PostgresJsDatabase<typeof schema>;
export type DrizzleClient =
  | DB
  | PostgresJsTransaction<
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >;
export * from "./schema";
export type { PostgresJsDatabase };
