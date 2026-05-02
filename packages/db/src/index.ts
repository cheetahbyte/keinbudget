import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const dbPath = Bun.env.DATABASE_URL ?? new URL("../local.db", import.meta.url).pathname;
const sqlite = new Database(dbPath);

sqlite.exec("PRAGMA foreign_keys = ON;");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL
  );
`);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    billingInterval TEXT NOT NULL DEFAULT 'monthly',
    categoryId INTEGER REFERENCES categories(id) ON DELETE SET NULL
  );
`);

const subscriptionColumns = sqlite
  .query("PRAGMA table_info(subscriptions)")
  .all() as Array<{ name: string }>;

if (!subscriptionColumns.some((column) => column.name === "categoryId")) {
  sqlite.exec(
    "ALTER TABLE subscriptions ADD COLUMN categoryId INTEGER REFERENCES categories(id) ON DELETE SET NULL;"
  );
}

if (!subscriptionColumns.some((column) => column.name === "billingInterval")) {
  sqlite.exec(
    "ALTER TABLE subscriptions ADD COLUMN billingInterval TEXT NOT NULL DEFAULT 'monthly';"
  );
}

sqlite.exec(
  "UPDATE subscriptions SET billingInterval = 'monthly' WHERE billingInterval IS NULL OR billingInterval = '';"
);

export const db = drizzle(sqlite, { schema });

export * from "./schema";
export type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
