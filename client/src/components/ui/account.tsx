import { useEffect, useState } from "react";
import { useServices } from "~/api/services/services.provider";
import type { Account } from "~/api/types/account";

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "~/components/lib/card";
import { Skeleton } from "~/components/lib/skeleton";

export default function AccountCard() {
	const { accountsService } = useServices();
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		accountsService!.getAccounts().then((data) => {
			setAccounts(data);
			setLoading(false);
		});
	}, [accountsService]);

	return (
		<div className="grid gap-4">
			{loading ? (
				<div className="space-y-2">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
				</div>
			) : accounts.length > 0 ? (
				accounts.map((account) => (
					<Card key={account.id}>
						<CardHeader>
							<CardTitle>{account.name}</CardTitle>
						</CardHeader>
						<CardContent className="flex justify-between items-center">
							<p className="text-sm text-muted-foreground">Current Balance</p>
							<p className="text-xl font-semibold text-primary">
								€ {account.currentBalance.toFixed(2)}
							</p>
						</CardContent>
					</Card>
				))
			) : (
				<p className="text-muted-foreground">No accounts found.</p>
			)}
		</div>
	);
}
