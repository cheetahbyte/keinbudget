import { ApiClient, DeleteResponse } from "../api";
import type { Transaction } from "../types/transaction";

export class TransactionService {
	private apiClient: ApiClient;

	constructor(apiClient: ApiClient) {
		this.apiClient = apiClient;
	}

	public async getLastTransactions(): Promise<Transaction[]> {
		return await this.apiClient.get<Transaction[]>("/transactions/last");
	}

	public async createTransaction(
		type: string,
		accountId: string,
		date: Date,
		amount: number,
		description: string,
	): Promise<Transaction> {
		if (type == "incoming")
			return await this.apiClient.post<Transaction>("/transactions/", {
				to_account: accountId,
				amount,
				description,
				created_at: date,
			});
		else if (type == "outgoing")
			return await this.apiClient.post<Transaction>("/transactions/", {
				from_account: accountId,
				amount,
				description,
				created_at: date,
			});
		else throw Error("unknown thing");
	}

	public async deleteTransaction(id: string) {
		await this.apiClient.delete<DeleteResponse>(`/transactions/${id}`);
	}

	public async getTransactionsForAccount(id: string): Promise<Transaction[]> {
		return await this.apiClient.get<Transaction[]>("/transactions/", {
			account_id: id,
		});
	}
}
