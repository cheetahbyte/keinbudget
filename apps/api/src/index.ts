import { auth } from "@keinbudget/auth";
import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { RPCHandler } from "@orpc/server/fetch";
import { apiReference } from "@scalar/hono-api-reference";
import { fileURLToPath } from "node:url";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { categoriesRPCRouter } from "./features/categories/categories.routes";
import { subscriptionsRPCRouter } from "./features/subscriptions/subscriptions.routes";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db } from "@keinbudget/db";
const appRouter = {
  categories: categoriesRPCRouter,
  subscriptions: subscriptionsRPCRouter,
};

const rpcHandler = new RPCHandler(appRouter);
const openApiHandler = new OpenAPIHandler(appRouter);
const openApiGenerator = new OpenAPIGenerator();

const app = new Hono();
const migrationsFolder = fileURLToPath(
  new URL("../../../packages/db/migrations", import.meta.url),
);

function buildCorsOrigins(): string[] {
  const rawOrigins = process.env.CORS_ORIGIN || "";
  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin);
}

app.use(
  cors({
    origin: ["http://localhost:3000", ...buildCorsOrigins()],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);

app.get("/openapi.json", async (c) => {
  const spec = await openApiGenerator.generate(appRouter, {
    info: { title: "keinbudget API", version: "1.0.0" },
  });
  return c.json(spec);
});

app.get("/docs", apiReference({ url: "/openapi.json" }));

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.all("/api/*", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const result = await openApiHandler.handle(c.req.raw, {
    prefix: "/api",
    context: { session },
  });
  if (result.matched) return result.response;
  return c.notFound();
});

app.all("/rpc/*", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const result = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: { session },
  });
  if (result.matched) return result.response;
  return c.notFound();
});

await migrate(db, { migrationsFolder });

export default {
  port: 4000,
  fetch: app.fetch,
};
