import { defineConfig } from "drizzle-kit";
import path from "path";

const url = process.env.DATABASE_URL
  ? `file:${process.env.DATABASE_URL}`
  : "file:local.db";

export default defineConfig({
  schema: path.join(import.meta.dir, "./src/schema/index.ts"),
  out: path.join(import.meta.dir, "./migrations"),
  dialect: "turso",
  dbCredentials: { url },
});
