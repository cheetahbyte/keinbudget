import type { ExtractTablesWithRelations } from "drizzle-orm";
import type {
  PostgresJsDatabase,
  PostgresJsTransaction,
} from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getRequestResource, isCloudflareWorkers } from "#/lib/request-store";

import * as schema from "./schema";

function createDb(): DB {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be set");
  }

  const sql = postgres(databaseUrl, {
    // Closes idle connections after 30s. On Workers the runtime additionally
    // closes all TCP sockets when the request ends; on Node this keeps the
    // per-process client from leaking connections.
    idle_timeout: 30,
    connect_timeout: 5,
    // Supabase transaction pooler (port 6543) rejects prepared statements
    prepare: false,
  });

  return drizzle(sql, { schema });
}

// On Cloudflare Workers each request gets its own client, keyed by the
// request context: sockets die with the request and env vars only exist
// inside the request lifecycle, so state must never be cached across
// requests. On Node one client per process is shared, as before.
let nodeDb: DB | undefined;

export function getDb(): DB {
  if (isCloudflareWorkers()) {
    return getRequestResource("db", createDb);
  }

  if (!nodeDb) {
    nodeDb = createDb();
  }

  return nodeDb;
}

export type DB = PostgresJsDatabase<typeof schema>;
export type DrizzleClient =
  | DB
  | PostgresJsTransaction<
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >;
export * from "./schema";
export type { PostgresJsDatabase };
