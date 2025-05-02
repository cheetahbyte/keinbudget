import { createContext, useContext } from "react"
import { ApiClient } from "../api";
import type { Account } from "../types/account";

interface AccountsServiceContextProps {
    accountsService: AccountsService
}

export const AccountsServiceContext = createContext<AccountsServiceContextProps|undefined>(undefined)

export const useAccountsService = (): AccountsService => {
    const context = useContext(AccountsServiceContext);
    if (!context) {
        throw new Error("useAccountsService must be used within a UserSerivceProvider")
    }
    return context.accountsService
}

export class AccountsService {
    private apiClient: ApiClient

    constructor(apiClient: ApiClient) {
       this.apiClient = apiClient
    }

    public async getAccounts(): Promise<Account[]> {
        return await this.apiClient.get<Account[]>("/accounts")
    }
}