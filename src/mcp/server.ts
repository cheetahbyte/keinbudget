import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import type { DrizzleClient } from "#/db";
import { MCP_WRITE_SCOPE } from "#/lib/mcp-scopes";
import { buildUpcomingRenewals, todayIso } from "#/lib/renewals";
import {
  createCategorySchema,
  createSubscriptionSchema,
  entityIdSchema,
  updateCategorySchema,
  updateSubscriptionSchema,
} from "#/schemas";
import { CategoryService } from "#/services/categories";
import { PreferencesService } from "#/services/preferences";
import { SubscriptionService } from "#/services/subscriptions";

export interface McpCaller {
  userId: string;
  scopes: ReadonlySet<string>;
}

function json(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value) }] };
}

function failure(message: string) {
  return {
    isError: true,
    content: [{ type: "text" as const, text: message }],
  };
}

export function createBudgetMcpServer(db: DrizzleClient, caller: McpCaller) {
  const server = new McpServer({ name: "keinbudget", version: "1.0.0" });
  const subscriptions = new SubscriptionService(db);
  const categories = new CategoryService(db);
  const preferences = new PreferencesService(db);
  const canWrite = caller.scopes.has(MCP_WRITE_SCOPE);

  const writeGuard =
    <Args, Result>(handler: (args: Args) => Promise<Result>) =>
    async (args: Args) => {
      if (!canWrite) {
        return failure(`Missing scope ${MCP_WRITE_SCOPE}`);
      }
      try {
        return json(await handler(args));
      } catch (error) {
        return failure(error instanceof Error ? error.message : String(error));
      }
    };

  server.registerTool(
    "list_entries",
    {
      description:
        "List all recurring entries (subscriptions, income, savings) with category, notes, active state, next billing date and price history.",
      inputSchema: z.object({}),
    },
    async () => json(await subscriptions.findAll(caller.userId)),
  );

  server.registerTool(
    "list_categories",
    {
      description: "List the user's categories with their type.",
      inputSchema: z.object({}),
    },
    async () => json(await categories.findAll(caller.userId)),
  );

  server.registerTool(
    "get_monthly_overview",
    {
      description:
        "Monthly totals of income, expenses, savings and what is left, plus the user's locale and currency.",
      inputSchema: z.object({}),
    },
    async () =>
      json({
        ...(await subscriptions.calculateMonthlyProjections(caller.userId)),
        preferences: await preferences.find(caller.userId),
      }),
  );

  server.registerTool(
    "upcoming_renewals",
    {
      description:
        "Active entries with a next billing date due within the given number of days.",
      inputSchema: z.object({
        withinDays: z.number().int().positive().max(365).default(30),
      }),
    },
    async ({ withinDays }) =>
      json(
        buildUpcomingRenewals(
          await subscriptions.findAll(caller.userId),
          todayIso(),
          withinDays,
        ).map((renewal) => ({
          id: renewal.entry.id,
          name: renewal.entry.name,
          price: renewal.entry.price,
          date: renewal.date,
          daysUntil: renewal.daysUntil,
        })),
      ),
  );

  server.registerTool(
    "create_entry",
    {
      description: "Create a recurring entry.",
      inputSchema: createSubscriptionSchema,
    },
    writeGuard((input) => subscriptions.create(caller.userId, input)),
  );

  server.registerTool(
    "update_entry",
    {
      description: "Update a recurring entry. All fields are replaced.",
      inputSchema: updateSubscriptionSchema,
    },
    writeGuard((input) => subscriptions.update(caller.userId, input)),
  );

  server.registerTool(
    "delete_entry",
    {
      description: "Delete a recurring entry by id.",
      inputSchema: entityIdSchema,
    },
    writeGuard(({ id }) => subscriptions.remove(caller.userId, id)),
  );

  server.registerTool(
    "create_category",
    {
      description: "Create a category (type: expense, savings or income).",
      inputSchema: createCategorySchema,
    },
    writeGuard((input) => categories.create(caller.userId, input)),
  );

  server.registerTool(
    "update_category",
    {
      description: "Update a category.",
      inputSchema: updateCategorySchema,
    },
    writeGuard((input) => categories.update(caller.userId, input)),
  );

  server.registerTool(
    "delete_category",
    {
      description: "Delete a category by id. Its entries become uncategorized.",
      inputSchema: entityIdSchema,
    },
    writeGuard(({ id }) => categories.remove(caller.userId, id)),
  );

  return server;
}
