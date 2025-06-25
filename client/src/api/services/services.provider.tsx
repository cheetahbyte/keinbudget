import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ApiClient } from "../api";
import { useToken } from "../hooks";
import type { Account } from "../types/account";
import type { Category } from "../types/category";
import { apiClientWithToken } from "../utils";
import { AccountsService } from "./accounts.service";
import { AuthService } from "./auth.service";
import { CategoryService } from "./category.service";
import { FinanceService } from "./finance.service";
import { UserService } from "./user.service";

export interface ServicesContextType {
  accountsService?: AccountsService;
  financeService?: FinanceService;
  userService?: UserService;
  categoryService?: CategoryService;
  authService: AuthService;
  accounts: Account[];
  categories: Category[];
  refetchAccounts: () => Promise<void>;
  refetchCategories: () => Promise<void>;
}

export const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined,
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

  const {
    accountsService,
    financeService,
    authService,
    userService,
    categoryService,
  } = useMemo(() => {
    const apiClient = new ApiClient();
    const client = token ? apiClientWithToken(apiClient, token) : apiClient;

    return {
      accountsService: token ? new AccountsService(client) : undefined,
      financeService: token ? new FinanceService(client) : undefined,
      userService: token ? new UserService(client) : undefined,
      categoryService: token ? new CategoryService(client) : undefined,
      authService: new AuthService(client),
    };
  }, [token]);

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
    if (!categoryService) return;
    refetchCategories();
  }, [categoryService, refetchCategories]);

  return (
    <ServicesContext.Provider
      value={{
        accountsService,
        financeService,
        userService,
        authService,
        categoryService,
        accounts,
        categories,
        refetchAccounts,
        refetchCategories,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
