import { create } from "zustand";
import type { AccountsService } from "../services/accounts.service";
import type { Account } from "../types/account";

interface AccountState {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  accountService: AccountsService | null;
}

interface AccountActions {
  actions: {
    loadAccounts: () => Promise<void>;
    createAccount: (name: string, startBalance: number) => Promise<void>;
    deleteAccount: (id: string) => Promise<void>;
  };
}

const useAccountStore = create<AccountState & AccountActions>((set, get) => ({
  accounts: [],
  isLoading: false,
  error: null,
  accountService: null,

  actions: {
    loadAccounts: async () => {
      const service = get().accountService;
      if (!service) return;
      set({ isLoading: true, error: null });

      try {
        const accounts = await service.getAccounts();
        set({ accounts });
      } catch (error) {
        if (error instanceof Error) {
          set({ error: error.message || "Failed to load accounts." });
        }
      } finally {
        set({ isLoading: false });
      }
    },
    createAccount: async (name: string, startBalance: number) => {
      const service = get().accountService;
      if (!service) return;
      set({ isLoading: true, error: null });
      try {
        const newAccount = await service.createAccount(name, startBalance);
        set((state) => ({ accounts: [newAccount, ...state.accounts] }));
      } catch (error) {
        if (error instanceof Error) {
          set({ error: error.message || "Failed to create account." });
        }
      }
    },
    deleteAccount: async (id: string) => {
      const service = get().accountService;
      if (!service) return;

      try {
        await service.deleteAccount(id);
        set((state) => ({
          accounts: state.accounts.filter((acc) => acc.id !== id),
        }));
      } catch (error) {
        if (error instanceof Error) {
          set({ error: error.message || "Failed to delete account." });
        }
      }
    },
  },
}));

export default useAccountStore;
