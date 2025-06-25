import { describe, expect, it, vi } from "vitest";
import type { ApiClient } from "../../src/api/api";
import { FinanceService } from "../../src/api/services/finance.service";
import type {
  FinanceOverview,
  MonthlyReportEntry,
} from "../../src/api/types/finance";

describe("FinanceService", () => {
  it("should fetch the finance overview", async () => {
    const overviewResponse: FinanceOverview = {
      totalBalance: 1000,
      income: 2000,
      expenses: 1000,
      savings: 100,
    };

    const mockedApiClient = {
      get: vi.fn().mockResolvedValueOnce(overviewResponse),
    } as unknown as ApiClient;

    const service = new FinanceService(mockedApiClient);
    const result = await service.getOverview();

    expect(mockedApiClient.get).toBeCalledTimes(1);
    expect(mockedApiClient.get).toBeCalledWith("/finance/");
    expect(result).toEqual(overviewResponse);
  });

  it("should fetch the monthly reports correctly", async () => {
    const reportData: MonthlyReportEntry[] = [
      { month: "2024-01", income: 1000, expenses: 500 },
      { month: "2024-02", income: 1100, expenses: 600 },
    ];

    const mockedApiClient = {
      get: vi.fn().mockResolvedValueOnce(reportData),
    } as unknown as ApiClient;

    const service = new FinanceService(mockedApiClient);
    const result = await service.getMonthlyReports(2, true);

    expect(mockedApiClient.get).toBeCalledTimes(1);
    expect(mockedApiClient.get).toBeCalledWith(
      "/finance/report?months=2&relevant_only=true",
    );
    expect(result).toEqual(reportData);
  });
});
