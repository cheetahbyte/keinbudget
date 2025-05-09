import { describe, it, vi, expect } from "vitest";
import type { ApiClient, DeleteResponse } from "../../src/api/api";
import { AccountsService } from "../../src/api/services/accounts.service";
import type { Account } from "../../src/api/types/account";

describe("AccountsService", () => {
	it("should execute getAccounts correctly", async () => {
		const accountsResponse = [{ id: "abc" }] as Account[];
		const mockedApiClient = {
			get: vi.fn().mockResolvedValueOnce(accountsResponse),
		} as unknown as ApiClient;

		const service = new AccountsService(mockedApiClient);

		const result = await service.getAccounts();
		expect(mockedApiClient.get).toBeCalledTimes(1);
		expect(mockedApiClient.get).toBeCalledWith("/accounts/");
		expect(result).toEqual(accountsResponse);
	});

	it("should execute createAccount correctly", async () => {
		const accountData = { name: "Test Account", startBalance: 11 };
		const mockedApiClient = {
			post: vi.fn().mockResolvedValueOnce(accountData),
		} as unknown as ApiClient;

		const service = new AccountsService(mockedApiClient);

		const result = await service.createAccount(
			accountData.name,
			accountData.startBalance,
		);
		expect(mockedApiClient.post).toBeCalledTimes(1);
		expect(mockedApiClient.post).toBeCalledWith("/accounts/", {
			start_balance: 11,
			name: "Test Account",
		});
		expect(result).toEqual(accountData);
	});

	it("should execute deleteAccount correctly", async () => {
		const deleteResponse: DeleteResponse = { deleted: "id" };
		const mockedApiClient = {
			delete: vi.fn().mockResolvedValueOnce(deleteResponse),
		} as unknown as ApiClient;

		const service = new AccountsService(mockedApiClient);

		const result = await service.deleteAccount("id");
		expect(mockedApiClient.delete).toBeCalledTimes(1);
		expect(mockedApiClient.delete).toBeCalledWith("/accounts/id");
		expect(result).toEqual(deleteResponse);
	});
});
