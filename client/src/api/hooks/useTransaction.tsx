import { useTransactionStore } from "../stores/transactions";

export function useTransactions() {
  return useTransactionStore((s) => s.transactions);
}
