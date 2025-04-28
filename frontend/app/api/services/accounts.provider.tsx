import type { ReactNode } from "react"
import { ApiClient } from "../api"
import { AccountsService, AccountsServiceContext } from "./accounts.service"

interface AccountsServiceProviderProps {
    token: string
    children: ReactNode
}

export const AccountsServiceProvider: React.FC<AccountsServiceProviderProps> = ({token, children}) => {
    const apiClient = new ApiClient(token)
    const accountsService = new AccountsService(apiClient)

    return (
        <AccountsServiceContext.Provider value={{accountsService}}>
            {children}
        </AccountsServiceContext.Provider>
    )
}