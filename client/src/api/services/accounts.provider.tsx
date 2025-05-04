import { useEffect, useMemo, useCallback, useState, type ReactNode } from "react";
import { ApiClient } from "../api";
import { AccountsService, AccountsServiceContext } from "./accounts.service";
import { useToken } from "../hooks";
import { apiClientWithToken } from "../utils";
import { Account } from "../types/account";

interface AccountsServiceProviderProps {
  children: ReactNode;
}

export const AccountsServiceProvider: React.FC<AccountsServiceProviderProps> = ({ children }) => {
  const token = useToken();
  const [accounts, setAccounts] = useState<Account[]>([]);

  const accountsService = useMemo(() => {
    if (!token) return null;
    const apiClient = new ApiClient();
    return new AccountsService(apiClientWithToken(apiClient, token));
  }, [token]);

  const refetchAccounts = useCallback(async () => {
    if (!accountsService) return;
    const result = await accountsService.getAccounts();
    setAccounts(result);
  }, [accountsService]);

  useEffect(() => {
    if (!accountsService) return;
    refetchAccounts();
  }, [accountsService, refetchAccounts]);

  if (!accountsService) return null;

  return (
    <AccountsServiceContext.Provider value={{ accountsService, accounts, refetchAccounts }}>
      {children}
    </AccountsServiceContext.Provider>
  );
};
