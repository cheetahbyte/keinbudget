import type { Route } from "./+types/home";
import { Button } from "~/components/lib/button";
import AccountCard from "~/components/ui/account";
import { useUser } from "~/api/hooks";
import { useAccountsService } from "~/api/services/accounts.service";
import { useAuth } from "~/api/services/login.service";
import FinanceOverview from "~/components/ui/home/FinanceOverview";
import FinanceGraph from "~/components/ui/home/FinanceGraph";
import RecentTransactions from "~/components/ui/home/RecentTransactions";
import { useState } from "react";

export function meta(obj: Route.MetaArgs) {
	return [
		{ title: "Keinbudget" },
		{ name: "description", content: "expense manager." },
	];
}

export default function Home() {
  const user = useUser();

  if (!user) {
    return <div>no.</div>
  }
  
  return (
    <div className="flex flex-col items-center justify-start min-h-svh px-4 py-8">
      <div className="w-full max-w-6xl space-y-6">
        <FinanceOverview />
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 w-full">
          <FinanceGraph />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
