import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ApiClient } from "../api";
import { useToken } from "../hooks";
import { apiClientWithToken } from "../utils";

import type { Account } from "../types/account";
import type { Transaction } from "../types/transaction";
import { AccountsService } from "./accounts.service";
import { AuthService } from "./auth.service";
import { FinanceService } from "./finance.service";
import { TransactionService } from "./transactions.service";
import { UserService } from "./user.service";
import type { Category } from "../types/category";
import { CategoryService } from "./category.service";

export interface ServicesContextType {
  accountsService?: AccountsService;
  financeService?: FinanceService;
  userService?: UserService;
  transactionsService?: TransactionService;
  categoryService?: CategoryService;
  authService: AuthService;
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  refetchAccounts: () => Promise<void>;
  refetchTransactions: () => Promise<void>;
  refetchCategories: () => Promise<void>;
}

export const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined
);

export const useServices = () => {
  const ctx = useContext(ServicesContext);
  if (!ctx)
    throw new Error("useServices must be used within a ServicesProvider");
  return ctx;
};

interface ServicesProviderProps {
  children: ReactNode;
}

export const ServicesProvider: React.FC<ServicesProviderProps> = ({
  children,
}) => {
  const token = useToken();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const {
    accountsService,
    financeService,
    authService,
    userService,
    transactionsService,
    categoryService,
  } = useMemo(() => {
    const apiClient = new ApiClient();
    const client = token ? apiClientWithToken(apiClient, token) : apiClient;

    return {
      accountsService: token ? new AccountsService(client) : undefined,
      transactionsService: token ? new TransactionService(client) : undefined,
      financeService: token ? new FinanceService(client) : undefined,
      userService: token ? new UserService(client) : undefined,
      categoryService: token ? new CategoryService(client) : undefined,
      authService: new AuthService(client),
    };
  }, [token]);

  const refetchTransactions = useCallback(async () => {
    if (!transactionsService) return;
    const result = await transactionsService.getLastTransactions();
    setTransactions(result);
  }, [transactionsService]);

  const refetchAccounts = useCallback(async () => {
    if (!accountsService) return;
    const result = await accountsService.getAccounts();
    setAccounts(result);
  }, [accountsService]);

  const refetchCategories = useCallback(async () => {
    if (!categoryService) return;
    const result = await categoryService.getCategories();
    setCategories(result);
  }, [categoryService]);

  useEffect(() => {
    if (!accountsService) return;
    refetchAccounts();
  }, [accountsService, refetchAccounts]);

  useEffect(() => {
    if (!transactionsService) return;
    refetchTransactions();
  }, [transactionsService, refetchTransactions]);

  useEffect(() => {
    if (!categoryService) return;
    refetchCategories();
  }, [categoryService, refetchCategories]);

  const isAuthPage = ["/login", "/register"].includes(window.location.pathname);
  if (!token && !isAuthPage) return null;

  return (
    <ServicesContext.Provider
      value={{
        accountsService,
        financeService,
        userService,
        authService,
        transactionsService,
        categoryService,
        accounts,
        transactions,
        categories,
        refetchAccounts,
        refetchTransactions,
        refetchCategories,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
