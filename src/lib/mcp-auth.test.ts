import { requireMcpAuth } from "@better-auth/mcp";
import { expect, it, vi } from "vitest";

import { Route } from "#/routes/api/mcp";

vi.mock("#/db", () => ({ getDb: vi.fn() }));
vi.mock("#/lib/auth", () => ({
  getAuth: () => ({
    options: {},
    $context: Promise.resolve({
      baseURL: "https://budget.example/api/auth",
      internalAdapter: {},
    }),
  }),
  getMcpResource: () => "https://budget.example/api/mcp",
}));
vi.mock("#/mcp/server", () => ({ createBudgetMcpServer: vi.fn() }));
vi.mock("#/services/connected-apps", () => ({ ConnectedAppsService: vi.fn() }));
vi.mock("@modelcontextprotocol/server", () => ({
  createMcpHandler: () => ({ fetch: vi.fn() }),
}));
vi.mock("@better-auth/mcp", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@better-auth/mcp")>();
  return { ...actual, requireMcpAuth: vi.fn(actual.requireMcpAuth) };
});

it("advertises read and write in the connection challenge but only requires read", async () => {
  const handlers = Route.options.server?.handlers;
  if (!handlers || typeof handlers === "function")
    throw new Error("Missing handlers");
  const handle = handlers.GET as (context: {
    request: Request;
  }) => Promise<Response>;
  const response = await handle({
    request: new Request("https://budget.example/api/mcp"),
  });

  expect(response.status).toBe(401);
  expect(response.headers.get("www-authenticate")).toContain(
    'scope="budget:read budget:write"',
  );
  expect(vi.mocked(requireMcpAuth).mock.lastCall?.[2]).toMatchObject({
    requiredScopes: ["budget:read"],
    challengeScopes: ["budget:read", "budget:write"],
  });
});
