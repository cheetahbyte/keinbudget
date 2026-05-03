import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set");
}

const sql = postgres(databaseUrl);

export const db = drizzle(sql, { schema });

export * from "./schema";
export { sql };
export type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
