import {
	useEffect,
	useMemo,
	useCallback,
	useState,
	type ReactNode,
	createContext,
	useContext,
} from "react";

import { useToken } from "../hooks";
import { apiClientWithToken } from "../utils";
import { ApiClient } from "../api";

import { AccountsService } from "./accounts.service";
import { FinanceService } from "./finance.service";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { TransactionService } from "./transactions.service";
import type { Account } from "../types/account";
import type { Transaction } from "../types/transaction";

export interface ServicesContextType {
	accountsService?: AccountsService;
	financeService?: FinanceService;
	userService?: UserService;
	transactionsService?: TransactionService;
	authService: AuthService;
	accounts: Account[];
	transactions: Transaction[];
	refetchAccounts: () => Promise<void>;
	refetchTransactions: () => Promise<void>;
}

export const ServicesContext = createContext<ServicesContextType | undefined>(
	undefined,
);

export const useServices = () => {
	const ctx = useContext(ServicesContext);
	if (!ctx)
		throw new Error("useServices must be used within a ServicesProvider");
	return ctx;
};

interface ServicesProviderProps {
	children: ReactNode;
}

export const ServicesProvider: React.FC<ServicesProviderProps> = ({
	children,
}) => {
	const token = useToken();
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const {
		accountsService,
		financeService,
		authService,
		userService,
		transactionsService,
	} = useMemo(() => {
		const apiClient = new ApiClient();
		const client = token ? apiClientWithToken(apiClient, token) : apiClient;

		return {
			accountsService: token ? new AccountsService(client) : undefined,
			transactionsService: token ? new TransactionService(client) : undefined,
			financeService: token ? new FinanceService(client) : undefined,
			userService: token ? new UserService(client) : undefined,
			authService: new AuthService(client),
		};
	}, [token]);

	const refetchTransactions = useCallback(async () => {
		if (!transactionsService) return;
		const result = await transactionsService.getLastTransactions();
		setTransactions(result);
	}, [transactionsService]);

	const refetchAccounts = useCallback(async () => {
		if (!accountsService) return;
		const result = await accountsService.getAccounts();
		setAccounts(result);
	}, [accountsService]);

	useEffect(() => {
		if (!accountsService) return;
		refetchAccounts();
	}, [accountsService, refetchAccounts]);

	useEffect(() => {
		if (!transactionsService) return;
		refetchTransactions();
	}, [transactionsService, refetchTransactions]);

	const isAuthPage = ["/login", "/register"].includes(window.location.pathname);
	if (!token && !isAuthPage) return null;

	return (
		<ServicesContext.Provider
			value={{
				accountsService,
				financeService,
				userService,
				authService,
				transactionsService,
				accounts,
				transactions,
				refetchAccounts,
				refetchTransactions,
			}}
		>
			{children}
		</ServicesContext.Provider>
	);
};
