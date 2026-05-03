import { defineConfig } from "drizzle-kit";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";

const dbDir = dirname(fileURLToPath(import.meta.url));
const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  "postgres://postgres:postgres@localhost:5432/keinbudget";

export default defineConfig({
  schema: path.join(dbDir, "./src/schema/index.ts"),
  out: path.join(dbDir, "./migrations"),
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: { url: databaseUrl },
});
