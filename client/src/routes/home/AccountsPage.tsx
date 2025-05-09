import { Trash2 } from "lucide-react";
import { useServices } from "~/api/services/services.provider";
import { Button } from "~/components/lib/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/lib/table";
import { AccountDetailsDrawer } from "~/components/ui/accounts/AccountDrawer";
import { AccountCreateSheet } from "~/components/ui/accounts/AccountSheet";

export default function AccountsPage() {
	const { accounts, accountsService, refetchAccounts, refetchTransactions } =
		useServices();

	const handleDelete = async (id: string) => {
		await accountsService!.deleteAccount(id);
		await refetchAccounts();
		await refetchTransactions();
	};

	return (
		<div className="p-6 max-w-5xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
					<p className="text-muted-foreground">Manage your accounts.</p>
				</div>
				<AccountCreateSheet />
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead className="text-center">Balance</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{accounts.length > 0 ? (
							accounts.map((account) => (
								<TableRow key={account.id}>
									<TableCell>{account.name}</TableCell>
									<TableCell className="text-center">
										{new Intl.NumberFormat("de-DE", {
											style: "currency",
											currency: "EUR",
										}).format(account.currentBalance)}
									</TableCell>
									<TableCell className="text-right flex justify-end gap-2">
										<AccountDetailsDrawer account={account} />
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(account.id)}
										>
											<Trash2 className="w-4 h-4 text-red-500" />
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={3}
									className="text-center text-muted-foreground"
								>
									No accounts found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
