import { createContext, useContext } from "react";
import type { ApiClient } from "../api";
import type { FinanceOverview, MonthlyReportEntry } from "../types/finance";

interface FinanceServiceContextProps {
  financeService: FinanceService;
}

export const FinanceServiceContext = createContext<
  FinanceServiceContextProps | undefined
>(undefined);

export const useFinance = (): FinanceService => {
  const context = useContext(FinanceServiceContext);
  if (!context) {
    throw new Error(
      "useAccountsService must be used within a UserSerivceProvider"
    );
  }
  return context.financeService;
};

export class FinanceService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async getOverview(): Promise<FinanceOverview> {
    return await this.apiClient.get<FinanceOverview>("/finance/");
  }

  public async getMonthlyReports(months: number, relevantOnly: boolean): Promise<MonthlyReportEntry[]> {
    return await this.apiClient.get<MonthlyReportEntry[]>(`/finance/report?months=${months}&relevant_only=${relevantOnly}`)
  }
}
