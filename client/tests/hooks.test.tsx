import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useToken, useUser } from "../src/api/hooks";
import { ServicesContext } from "../src/api/services/services.provider";
import { UserService } from "../src/api/services/user.service";

function TestComponent() {
	const token = useToken();
	return <div>{token ?? "No token"}</div>;
}

function TestUserComponent() {
	const user = useUser();
	if (!user) return <div>loading...</div>;
	return <div>{user.email}</div>;
}

describe("useToken", () => {
	beforeEach(() => localStorage.clear());

	it("returns the token from localStorage", () => {
		localStorage.setItem("token", "test-token");
		render(<TestComponent />);
		expect(screen.getByText("test-token")).toBeInTheDocument();
	});

	it("returns null if token is missing", () => {
		render(<TestComponent />);
		expect(screen.getByText("No token")).toBeInTheDocument();
	});
});

describe("useUser", () => {
	beforeEach(() => {
		localStorage.clear();
		localStorage.setItem("token", "token");
	});

	it("fetches and returns the user", async () => {
		const mockUser = { id: "123", email: "test@example.com" };
		const mockApiClient = {
			get: vi.fn().mockResolvedValueOnce(mockUser),
		};
		const mockUserService = {
			getMe: () => mockApiClient.get("/me"),
			apiClient: {}, // add a dummy field just to satisfy TS
		} as unknown as UserService;

		const mockServices = {
			userService: mockUserService,
			authService: {} as any,
			accountsService: {} as any,
			financeService: {} as any,
			transactionsService: {} as any,
			accounts: [],
			transactions: [],
			refetchAccounts: () => Promise.resolve(),
			refetchTransactions: () => Promise.resolve(),
		};

		render(
			<ServicesContext.Provider value={mockServices}>
				<TestUserComponent />
			</ServicesContext.Provider>,
		);

		await waitFor(() => {
			expect(screen.getByText("test@example.com")).toBeInTheDocument();
		});
	});
});
