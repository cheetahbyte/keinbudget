import type { ApiClient } from "../api";
import type { FinanceOverview, MonthlyReportEntry } from "../types/finance";

export class FinanceService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async getOverview(): Promise<FinanceOverview> {
    return await this.apiClient.get<FinanceOverview>("/finance/");
  }

  public async getMonthlyReports(
    months: number,
    relevantOnly: boolean,
  ): Promise<MonthlyReportEntry[]> {
    return await this.apiClient.get<MonthlyReportEntry[]>(
      `/finance/report?months=${months}&relevant_only=${relevantOnly}`,
    );
  }
}
