import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL?.trim()!;

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: { url: databaseUrl },
});
