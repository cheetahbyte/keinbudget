// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { Category, Subscription } from "#/lib/dashboard/types";

import {
  ActiveSubscriptions,
  filterSubscriptionsByType,
} from "./SubscriptionsSection";

afterEach(cleanup);

// Radix Switch measures its thumb; jsdom has no ResizeObserver
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as typeof ResizeObserver;

function subscription(
  name: string,
  categoryType: Category["type"] | null,
): Subscription {
  return {
    id: 1,
    name,
    price: 10,
    billingInterval: "monthly",
    category: categoryType
      ? { id: 1, name, icon: "☕", type: categoryType }
      : null,
    notes: "",
    isActive: true,
    nextBillingDate: null,
    priceHistory: [],
  };
}

const expense = subscription("Netflix", "expense");
const savings = subscription("ETF", "savings");
const income = subscription("Salary", "income");
const uncategorized = subscription("Coffee", null);

it("filters entries with inline choices and keeps the add action available", () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ActiveSubscriptions
        categories={[]}
        subscriptions={[expense, income].map((entry, id) => ({ ...entry, id }))}
      />
    </QueryClientProvider>,
  );

  expect(screen.getByRole("radio", { name: "All" }).getAttribute("type")).toBe(
    "radio",
  );
  expect(screen.getByText("Netflix", { selector: "h3" })).toBeTruthy();
  fireEvent.click(screen.getByRole("radio", { name: "Income" }));
  expect(screen.queryByText("Netflix", { selector: "h3" })).toBeNull();
  expect(screen.getByText("Salary", { selector: "h3" })).toBeTruthy();
  expect(screen.getByText("1 of 2 entries")).toBeTruthy();
  fireEvent.click(screen.getByRole("radio", { name: "Savings" }));
  expect(screen.getByText("No entries of this type yet.")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Add entry" }));
  expect(screen.getByRole("dialog")).toBeTruthy();
});

describe("filterSubscriptionsByType", () => {
  const all = [expense, savings, income, uncategorized];

  it("returns everything for the all filter", () => {
    expect(filterSubscriptionsByType(all, "all")).toEqual(all);
  });

  it("keeps expense entries and treats uncategorized as expense", () => {
    expect(filterSubscriptionsByType(all, "expense")).toEqual([
      expense,
      uncategorized,
    ]);
  });

  it("keeps only savings entries", () => {
    expect(filterSubscriptionsByType(all, "savings")).toEqual([savings]);
  });

  it("keeps only income entries", () => {
    expect(filterSubscriptionsByType(all, "income")).toEqual([income]);
  });
});
