import { createContext, useContext } from "react";
import { DeleteResponse, type ApiClient } from "../api";
import type { Account } from "../types/account";

interface AccountsServiceContextProps {
	accountsService: AccountsService;
	accounts: Account[],
	refetchAccounts: () => void
}

export const AccountsServiceContext = createContext<
	AccountsServiceContextProps | undefined
>(undefined);

export const useAccountsService = (): AccountsService => {
	const context = useContext(AccountsServiceContext);
	if (!context) {
		throw new Error(
			"useAccountsService must be used within a UserSerivceProvider",
		);
	}
	return context.accountsService;
};

export const useAccountContext = (): AccountsServiceContextProps => {
	const context = useContext(AccountsServiceContext);
	if (!context) {
		throw new Error(
			"useAccountsService must be used within a UserSerivceProvider",
		);
	}
	return context
}

export class AccountsService {
	private apiClient: ApiClient;

	constructor(apiClient: ApiClient) {
		this.apiClient = apiClient;
	}

	public async getAccounts(): Promise<Account[]> {
		return await this.apiClient.get<Account[]>("/accounts");
	}

	public async createAccount(name: string, startBalance: number): Promise<Account> {
		return await this.apiClient.post<Account>("/accounts", {name, "start_balance": startBalance})
	}

	public async deleteAccount(id: string) {
		return await this.apiClient.delete<DeleteResponse>(`/accounts/${id}`)
	}
}
