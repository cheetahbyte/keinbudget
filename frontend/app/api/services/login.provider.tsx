import type { ReactNode } from "react";
import { ApiClient } from "../api";
import { AuthService, AuthServiceContext } from "./login.service";

interface AccountsServiceProviderProps {
	token: string;
	children: ReactNode;
}

export const AuthServiceProvider: React.FC<AccountsServiceProviderProps> = ({
	token,
	children,
}) => {
	const apiClient = new ApiClient(token);
	const authService = new AuthService(apiClient);

	return (
		<AuthServiceContext.Provider value={{ authService }}>
			{children}
		</AuthServiceContext.Provider>
	);
};
