import { useEffect, useMemo, useCallback, useState, type ReactNode } from "react";
import { ApiClient } from "../api";
import { TransactionService, TransactionServiceContext } from "./transactions.service";
import { useToken } from "../hooks";
import { apiClientWithToken } from "../utils";
import { Transaction } from "../types/transaction";

interface TransactionsServiceProviderProps {
  children: ReactNode;
}

export const TransactionServiceProvider: React.FC<TransactionsServiceProviderProps> = ({ children }) => {
  const token = useToken();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const transactionService = useMemo(() => {
    if (!token) return null;
    const apiClient = new ApiClient();
    return new TransactionService(apiClientWithToken(apiClient, token));
  }, [token]);

  const refetchTransactions = useCallback(async () => {
    if (!transactionService) return;
    const result = await transactionService.getLastTransactions();
    setTransactions(result);
  }, [transactionService]);

  useEffect(() => {
    if (!transactionService) return;
    refetchTransactions();
  }, [transactionService, refetchTransactions]);

  if (!transactionService) return null;

  return (
    <TransactionServiceContext.Provider value={{ transactionService, transactions, refetchTransactions }}>
      {children}
    </TransactionServiceContext.Provider>
  );
};
