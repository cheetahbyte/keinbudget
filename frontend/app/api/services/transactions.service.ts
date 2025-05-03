import { createContext, useContext } from "react"
import { ApiClient } from "../api";
import type { Account } from "../types/account";
import type { Transaction } from "../types/transaction";

interface TransactionServiceContextProps {
    transactionService: TransactionService
}

export const TransactionServiceContext = createContext<TransactionServiceContextProps|undefined>(undefined)

export const useTransactionService = (): TransactionService => {
    const context = useContext(TransactionServiceContext);
    if (!context) {
        throw new Error("useTransactionService must be used within a UserSerivceProvider")
    }
    return context.transactionService
}

export class TransactionService {
    private apiClient: ApiClient

    constructor(apiClient: ApiClient) {
       this.apiClient = apiClient
    }

    public async getLastTransactions(): Promise<Transaction[]> {
        return await this.apiClient.get<Transaction[]>("/transactions/last")
    }
}