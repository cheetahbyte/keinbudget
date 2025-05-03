import type { ReactNode } from "react"
import { ApiClient } from "../api"
import { AuthService, AuthServiceContext } from "./login.service"
import { apiClientWithToken } from "../utils"
import { useToken } from "../hooks"

interface AccountsServiceProviderProps {
    children: ReactNode
}

export const AuthServiceProvider: React.FC<AccountsServiceProviderProps> = ({children}) => {
    const token = useToken();

    if (!token) return null;

    const apiClient = new ApiClient();
    const authService = new AuthService(apiClientWithToken(apiClient, token));

	return (
		<AuthServiceContext.Provider value={{ authService }}>
			{children}
		</AuthServiceContext.Provider>
	);
};
