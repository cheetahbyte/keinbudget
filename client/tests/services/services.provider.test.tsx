import { render, waitFor, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiClient } from "../../src/api/api";
import {
  ServicesProvider,
  useServices,
} from "../../src/api/services/services.provider";
import type { Account } from "../../src/api/types/account";
import type { Transaction } from "../../src/api/types/transaction";

function mockLocation(path: string) {
  const original = window.location;
  const newLocation = { ...original, pathname: path };
  Object.defineProperty(window, "location", {
    configurable: true,
    value: newLocation,
  });
  return () =>
    Object.defineProperty(window, "location", {
      configurable: true,
      value: original,
    });
}

vi.mock("../../src/api/services/accounts.service", () => ({
  AccountsService: vi.fn().mockImplementation(() => ({
    getAccounts: vi.fn().mockResolvedValue([{ id: "acc1" }] as Account[]),
  })),
}));

vi.mock("../../src/api/services/transactions.service", () => ({
  TransactionService: vi.fn().mockImplementation(() => ({
    getLastTransactions: vi
      .fn()
      .mockResolvedValue([{ id: "tx1" }] as Transaction[]),
  })),
}));

vi.mock("../../src/api/services/auth.service", () => ({
  AuthService: vi.fn().mockImplementation(() => ({})),
}));

vi.mock("../../src/api/services/finance.service", () => ({
  FinanceService: vi.fn().mockImplementation(() => ({})),
}));

vi.mock("../../src/api/services/user.service", () => ({
  UserService: vi.fn().mockImplementation(() => ({})),
}));

vi.mock("../../src/api/services/category.service", () => ({
  CategoryService: vi.fn().mockImplementation(() => ({
    getCategories: vi.fn().mockResolvedValue([{ id: "cat1" }]),
  })),
}));

vi.mock("../../src/api/hooks", () => ({
  useToken: vi.fn(() => "test-token"),
}));

vi.mock("../../src/api/utils", () => ({
  apiClientWithToken: (client: ApiClient, _token: string) => client,
}));

vi.mock("../../src/api", () => ({
  ApiClient: vi.fn().mockImplementation(() => ({})),
}));

function TestComponent() {
  const { accounts, transactions } = useServices();
  return (
    <div>
      <div data-testid="accounts">{accounts.length}</div>
      <div data-testid="transactions">{transactions.length}</div>
    </div>
  );
}

describe("ServicesProvider", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("provides accounts and transactions", async () => {
    render(
      <ServicesProvider>
        <TestComponent />
      </ServicesProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("accounts").textContent).toBe("1");
      expect(screen.getByTestId("transactions").textContent).toBe("1");
    });
  });

  it("does not render children if no token and not on login/register", () => {
    const restoreLocation = mockLocation("/some-private-page");

    const useTokenMock = vi.fn(() => undefined);
    vi.doMock("../../src/api/hooks", () => ({ useToken: useTokenMock }));

    const { container } = render(
      <ServicesProvider>
        <div>Should not render</div>
      </ServicesProvider>
    );

    expect(container.innerHTML).toBe("<div>Should not render</div>");

    restoreLocation();
  });
});
