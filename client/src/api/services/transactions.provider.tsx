import type { ReactNode } from "react";
import { ApiClient } from "../api";
import { TransactionService, TransactionServiceContext } from "./transactions.service";
import { useToken } from "../hooks";
import { apiClientWithToken } from "../utils";

interface TransactionsServiceProviderProps {
  children: ReactNode;
}

export const TransactionServiceProvider: React.FC<
TransactionsServiceProviderProps
> = ({ children }) => {
  const token = useToken();

  if (!token) return null;

  const apiClient = new ApiClient();
  const transactionService = new TransactionService(apiClientWithToken(apiClient, token));

  return (
    <TransactionServiceContext.Provider value={{ transactionService }}>
      {children}
    </TransactionServiceContext.Provider>
  );
};
