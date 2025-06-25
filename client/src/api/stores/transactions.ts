import { create } from "zustand";
import type { Transaction } from "../types/transaction";
import type { TransactionService } from "../services/transactions.service";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  transactionService: TransactionService | null;
}

interface TransactionActions {
  actions: {
    initService: (service: TransactionService) => void;
    loadLastTransactions: () => Promise<void>;
    createTransaction: (
      type: string,
      accountId: string,
      date: Date,
      amount: number,
      description: string,
      category: string
    ) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    getTransactionsForAccount: (accountId: string) => Promise<Transaction[]>;
  };
}
export const useTransactionStore = create<
  TransactionState & TransactionActions
>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  transactionService: null,

  actions: {
    initService: (service) => set({ transactionService: service }),

    loadLastTransactions: async () => {
      const service = get().transactionService;
      if (!service) return;

      set({ isLoading: true, error: null });
      try {
        const transactions = await service.getLastTransactions();
        const sorted = transactions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        set({ transactions: sorted });
      } catch (error) {
        if (error instanceof Error) {
          set({ error: error.message || "Failed to load transactions." });
        }
      } finally {
        set({ isLoading: false });
      }
    },

    createTransaction: async (
      type,
      accountId,
      date,
      amount,
      description,
      category
    ) => {
      const service = get().transactionService;
      if (!service) return;

      try {
        const newTx = await service.createTransaction(
          type,
          accountId,
          date,
          amount,
          description,
          category
        );
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));
      } catch (error) {
        if (error instanceof Error) {
          set({ error: error.message || "Failed to create transaction." });
        }
      }
    },

    deleteTransaction: async (id: string) => {
      const service = get().transactionService;
      if (!service) return;

      try {
        await service.deleteTransaction(id);
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        }));
      } catch (error) {
        if (error instanceof Error) {
          set({ error: error.message || "Failed to delete transaction." });
        }
      }
    },

    getTransactionsForAccount: async (accountId: string) => {
      const service = get().transactionService;
      if (!service) return [];

      try {
        return await service.getTransactionsForAccount(accountId);
      } catch (error) {
        if (error instanceof Error) {
          set({ error: error.message || "Failed to load transactions." });
        }
        return [];
      }
    },
  },
}));
