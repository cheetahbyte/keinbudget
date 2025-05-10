export type FinanceOverview = {
	totalBalance: number;
	income: number;
	expenses: number;
	savings: number;
};

export type MonthlyReportEntry = {
	month: string;
	income: number;
	expenses: number;
};
