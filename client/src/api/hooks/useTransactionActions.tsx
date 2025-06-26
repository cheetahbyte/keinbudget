import { useTransactionStore } from "../stores/transactions";

function useTransactionsActions() {
  return useTransactionStore((s) => s.actions);
}

export default useTransactionsActions;
