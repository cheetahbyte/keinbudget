import type { ReactNode } from "react";
import { useToken } from "../hooks";
import { apiClientWithToken } from "../utils";
import { ApiClient } from "../api";
import { FinanceService, FinanceServiceContext } from "./finance.service";

interface FinanceServiceProviderProps {
  children: ReactNode;
}

export const FinanceServiceProvider: React.FC<FinanceServiceProviderProps> = ({
  children,
}) => {
  const token = useToken();
  if (!token) return null;

  const apiClient = new ApiClient();
  const financeService = new FinanceService(
    apiClientWithToken(apiClient, token)
  );

  return (
    <FinanceServiceContext.Provider value={{ financeService }}>
      {children}
    </FinanceServiceContext.Provider>
  );
};
