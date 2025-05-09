import { Button } from "~/components/lib/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/lib/table";
import { Trash2 } from "lucide-react";
import { TransactionCreateSheet } from "~/components/ui/transactions/TransactionSheet";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useServices } from "~/api/services/services.provider";

export default function AccountsPage() {
	const { transactions, transactionsService, refetchTransactions, accounts } =
		useServices();
	const handleDelete = async (id: string) => {
		await transactionsService!.deleteTransaction(id);
		refetchTransactions();
	};

	return (
		<div className="p-6 max-w-5xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
					<p className="text-muted-foreground">Manage your transactions.</p>
				</div>
				<TransactionCreateSheet />
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Description</TableHead>
							<TableHead className="text-center">Account</TableHead>
							<TableHead className="text-center">Amount</TableHead>
							<TableHead className="text-center">Date</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.length > 0 ? (
							transactions.map((transaction) => (
								<TableRow key={transaction.id} className="h-14">
									<TableCell>{transaction.description}</TableCell>
									<TableCell className="text-center align-middle">
										{accounts.find(
											(e) =>
												e.id === transaction.fromAccount ||
												e.id === transaction.toAccount,
										)?.name ?? "—"}
									</TableCell>
									<TableCell className="text-center align-middle">
										{new Intl.NumberFormat("de-DE", {
											style: "currency",
											currency: "EUR",
										}).format(transaction.amount)}
									</TableCell>
									<TableCell className="text-center align-middle">
										{transaction.createdAt
											? format(new Date(transaction.createdAt), "dd.MM.yyyy", {
													locale: de,
												})
											: "—"}
									</TableCell>
									<TableCell className="text-right flex justify-end gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(transaction.id)}
										>
											<Trash2 className="w-4 h-4 text-red-500" />
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center text-muted-foreground"
								>
									No transactions found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
