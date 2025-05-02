import type { ReactNode } from "react";
import { ApiClient } from "../api";
import { UserService, UserServiceContext } from "./user.service";

interface UserServiceProviderProps {
    token: string
    children: ReactNode
}

export const UserServiceProvider: React.FC<UserServiceProviderProps> = ({ token, children }) => {
    const apiClient = new ApiClient(token);
    const userService = new UserService(apiClient);

    return (
        <UserServiceContext.Provider value={{ userService }}>
            {children}
        </UserServiceContext.Provider>
    );
};