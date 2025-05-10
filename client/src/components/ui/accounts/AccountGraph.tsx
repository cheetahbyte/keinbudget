import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useMemo } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { Transaction } from "~/api/types/transaction";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/lib/card";

interface AccountGraphProps {
	transactions: Transaction[];
	accountId: string;
}

interface MonthlyData {
	month: string;
	income: number;
	expenses: number;
}

export default function AccountGraph({
	transactions,
	accountId,
}: AccountGraphProps) {
	const data: MonthlyData[] = useMemo(() => {
		const map = new Map<string, { income: number; expenses: number }>();

		for (const tx of transactions) {
			const date = new Date(tx.createdAt);
			const month = format(date, "MM.yyyy", { locale: de });

			const isIncoming = tx.toAccount === accountId;
			const isOutgoing = tx.fromAccount === accountId;

			if (!isIncoming && !isOutgoing) continue;

			if (!map.has(month)) {
				map.set(month, { income: 0, expenses: 0 });
			}

			const entry = map.get(month)!;

			if (isIncoming) entry.income += tx.amount;
			if (isOutgoing) entry.expenses += tx.amount;
		}

		const result = Array.from(map.entries())
			.map(([month, values]) => ({
				month,
				date: new Date(`01.${month}`), // Hilfswert zum Sortieren
				...values,
			}))
			.sort((a, b) => a.date.getTime() - b.date.getTime())
			.map(({ ...rest }) => rest);

		return result;
	}, [transactions, accountId]);

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>Kontoverlauf</CardTitle>
				<CardDescription>Einnahmen & Ausgaben pro Monat</CardDescription>
			</CardHeader>
			<CardContent className="h-48 space-y-4">
				{data.length === 0 ? (
					<div className="text-sm text-muted-foreground text-center">
						Keine Daten verfügbar
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
