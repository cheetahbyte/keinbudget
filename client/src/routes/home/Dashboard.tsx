import FinanceGraph from "~/components/ui/home/FinanceGraph";
import FinanceOverview from "~/components/ui/home/FinanceOverview";
import RecentTransactions from "~/components/ui/home/RecentTransactions";

export default function Home() {
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
