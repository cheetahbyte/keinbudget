import { defineConfig } from "drizzle-kit";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  "postgres://postgres:postgres@localhost:5432/keinbudget";

export default defineConfig({
  schema: path.join(__dirname, "./src/server/db/schema/index.ts"),
  out: path.join(__dirname, "./migrations"),
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: { url: databaseUrl },
});
