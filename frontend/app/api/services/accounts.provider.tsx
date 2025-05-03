import type { ReactNode } from "react";
import { ApiClient } from "../api";
import { AccountsService, AccountsServiceContext } from "./accounts.service";
import { useToken } from "../hooks";
import { apiClientWithToken } from "../utils";

interface AccountsServiceProviderProps {
  children: ReactNode;
}

export const AccountsServiceProvider: React.FC<
  AccountsServiceProviderProps
> = ({ children }) => {
  const token = useToken();

  if (!token) return null;

  const apiClient = new ApiClient();
  const accountsService = new AccountsService(apiClientWithToken(apiClient, token));

  return (
    <AccountsServiceContext.Provider value={{ accountsService }}>
      {children}
    </AccountsServiceContext.Provider>
  );
};
