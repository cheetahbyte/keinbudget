import { type ApiClient, DeleteResponse } from "../api";
import type { Account } from "../types/account";
export class AccountsService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async getAccounts(): Promise<Account[]> {
    return await this.apiClient.get<Account[]>("/accounts/");
  }

  public async createAccount(
    name: string,
    startBalance: number,
  ): Promise<Account> {
    return await this.apiClient.post<Account>("/accounts/", {
      name,
      start_balance: startBalance,
    });
  }

  public async deleteAccount(id: string) {
    return await this.apiClient.delete<DeleteResponse>(`/accounts/${id}`);
  }
}
