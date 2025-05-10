import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useServices } from "~/api/services/services.provider";
import type { MonthlyReportEntry } from "~/api/types/finance";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/lib/card";
import { Checkbox } from "~/components/lib/checkbox"; // oder Switch, je nach Designsystem
import { Label } from "~/components/lib/label";

export default function FinanceGraph() {
	const { financeService } = useServices();
	const [data, setData] = useState<MonthlyReportEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [relevantOnly, setRelevantOnly] = useState<boolean>(true); // Toggle

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			try {
				const result = await financeService!.getMonthlyReports(6, relevantOnly);
				setData(result);
			} catch (error) {
				console.error("error loading data:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [relevantOnly, financeService]);

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>Financial Overview</CardTitle>
				<CardDescription>
					Your income and expenses for the past 6 months
				</CardDescription>
			</CardHeader>
			<CardContent className="h-64 space-y-4">
				<div className="flex items-center space-x-2">
					<Checkbox
						id="relevantOnly"
						checked={relevantOnly}
						onCheckedChange={(val) => setRelevantOnly(Boolean(val))}
					/>
					<Label htmlFor="relevantOnly">Show only months with data</Label>
				</div>
				{loading ? (
					<div className="text-center text-sm text-muted-foreground">
						Loading...
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis
								tickFormatter={(value) => `${value.toLocaleString("de-DE")} €`}
								tick={{ fontSize: 12, fill: "#6b7280" }}
							/>
							<Tooltip />
							<Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
							<Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
}
