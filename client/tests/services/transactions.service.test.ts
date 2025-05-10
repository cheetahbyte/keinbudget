import { describe, expect, it, vi } from "vitest";
import type { ApiClient } from "../../src/api/api";
import { TransactionService } from "../../src/api/services/transactions.service";
import type { Transaction } from "../../src/api/types/transaction";

describe("TransactionService", () => {
	it("should fetch last transactions", async () => {
		const mockTransactions: Transaction[] = [
			{ id: "tx1", amount: 100 },
		] as Transaction[];

		const mockedApiClient = {
			get: vi.fn().mockResolvedValueOnce(mockTransactions),
		} as unknown as ApiClient;

		const service = new TransactionService(mockedApiClient);
		const result = await service.getLastTransactions();

		expect(mockedApiClient.get).toBeCalledWith("/transactions/last");
		expect(result).toEqual(mockTransactions);
	});

	it("should create incoming transaction", async () => {
		const mockTx: Transaction = { id: "tx2", amount: 100 } as Transaction;

		const mockedApiClient = {
			post: vi.fn().mockResolvedValueOnce(mockTx),
		} as unknown as ApiClient;

		const service = new TransactionService(mockedApiClient);
		const result = await service.createTransaction(
			"incoming",
			"acc1",
			new Date("2024-01-01"),
			100,
			"Test",
		);

		expect(mockedApiClient.post).toBeCalledWith("/transactions/", {
			to_account: "acc1",
			amount: 100,
			description: "Test",
			created_at: new Date("2024-01-01"),
		});
		expect(result).toEqual(mockTx);
	});

	it("should create outgoing transaction", async () => {
		const mockTx: Transaction = { id: "tx3", amount: 50 } as Transaction;

		const mockedApiClient = {
			post: vi.fn().mockResolvedValueOnce(mockTx),
		} as unknown as ApiClient;

		const service = new TransactionService(mockedApiClient);
		const result = await service.createTransaction(
			"outgoing",
			"acc2",
			new Date("2024-02-01"),
			50,
			"Test 2",
		);

		expect(mockedApiClient.post).toBeCalledWith("/transactions/", {
			from_account: "acc2",
			amount: 50,
			description: "Test 2",
			created_at: new Date("2024-02-01"),
		});
		expect(result).toEqual(mockTx);
	});

	it("should throw error for invalid type", async () => {
		const mockedApiClient = {
			post: vi.fn(),
		} as unknown as ApiClient;

		const service = new TransactionService(mockedApiClient);

		await expect(() =>
			service.createTransaction("invalid", "id", new Date(), 0, "desc"),
		).rejects.toThrow("unknown thing");
	});

	it("should delete transaction", async () => {
		const mockedApiClient = {
			delete: vi.fn().mockResolvedValueOnce({ deleted: "tx1" }),
		} as unknown as ApiClient;

		const service = new TransactionService(mockedApiClient);
		await service.deleteTransaction("tx1");

		expect(mockedApiClient.delete).toBeCalledWith("/transactions/tx1");
	});

	it("should fetch transactions for account", async () => {
		const mockTransactions: Transaction[] = [
			{ id: "tx4", amount: 200 },
		] as Transaction[];

		const mockedApiClient = {
			get: vi.fn().mockResolvedValueOnce(mockTransactions),
		} as unknown as ApiClient;

		const service = new TransactionService(mockedApiClient);
		const result = await service.getTransactionsForAccount("acc123");

		expect(mockedApiClient.get).toBeCalledWith("/transactions/", {
			account_id: "acc123",
		});
		expect(result).toEqual(mockTransactions);
	});
});
