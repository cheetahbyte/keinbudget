import { type ReactNode, createContext, useContext } from "react";
import type { ApiClient } from "../api";
import type { User } from "../types/user";

interface UserServiceContextProps {
	userService: UserService;
}

export const UserServiceContext = createContext<
	UserServiceContextProps | undefined
>(undefined);

export const useUserService = (): UserService => {
	const context = useContext(UserServiceContext);
	if (!context) {
		throw new Error("useUserService must be used within a UserServiceProvider");
	}
	return context.userService;
};

export class UserService {
	private apiClient: ApiClient;

	constructor(apiClient: ApiClient) {
		this.apiClient = apiClient;
	}

	public async getMe(): Promise<User> {
		return await this.apiClient.get<User>("/users/me");
	}
}
