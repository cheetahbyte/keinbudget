// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { Header } from "./header";

vi.mock("#/lib/auth-client", () => ({
  authClient: { useSession: () => ({ data: null, isPending: false }) },
}));

afterEach(cleanup);

it.each([
  "/settings",
  "/settings/security",
  "/settings/integrations",
  "/settings/account",
])("keeps Settings active at %s", async (path) => {
  const root = createRootRoute({ component: Header });
  const settings = createRoute({ getParentRoute: () => root, path });
  const router = createRouter({
    routeTree: root.addChildren([settings]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await router.load();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  expect(
    (await screen.findByRole("link", { name: "Settings" })).getAttribute(
      "aria-current",
    ),
  ).toBe("page");
  expect(
    screen.getByRole("link", { name: "Overview" }).getAttribute("aria-current"),
  ).toBeNull();
});

it.each(["daily", "monthly", "yearly"])(
  "keeps Overview active for the %s period",
  async (period) => {
    const root = createRootRoute({ component: Header });
    const index = createRoute({ getParentRoute: () => root, path: "/" });
    const router = createRouter({
      routeTree: root.addChildren([index]),
      history: createMemoryHistory({ initialEntries: [`/?period=${period}`] }),
    });
    await router.load();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
    expect(
      (await screen.findByRole("link", { name: "Overview" })).getAttribute(
        "aria-current",
      ),
    ).toBe("page");
    expect(
      screen
        .getByRole("link", { name: "Breakdown" })
        .getAttribute("aria-current"),
    ).toBeNull();
  },
);
