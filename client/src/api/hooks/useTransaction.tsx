import { useTransactionStore } from "../stores/transactions";

function useTransactions() {
  return useTransactionStore((s) => s.transactions);
}

export default useTransactions;
