import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set");
}

export const db = drizzle({ connection: { url: databaseUrl }, schema });

export * from "./schema";
export type { BunSQLDatabase } from "drizzle-orm/bun-sql";
