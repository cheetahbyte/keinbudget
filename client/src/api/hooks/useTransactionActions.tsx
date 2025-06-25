import { useTransactionStore } from "../stores/transactions";

export function useTransactionsActions() {
  return useTransactionStore((s) => s.actions);
}
