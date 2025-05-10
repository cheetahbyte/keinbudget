import type { ApiClient } from "../api";
import { User } from "../types/user";

type tokenType = "Bearer";

export type AuthServiceTokenRequest = {
	token: string;
	tokenType: tokenType;
	intermediate: boolean;
};

export class AuthService {
	private apiClient: ApiClient;

	constructor(apiClient: ApiClient) {
		this.apiClient = apiClient;
	}

	public async login(
		username: string,
		password: string,
	): Promise<AuthServiceTokenRequest> {
		const response = await this.apiClient.post<AuthServiceTokenRequest>(
			"/auth/login",
			{
				username,
				password,
			},
		);
		return response;
	}

	public async signUp(
		email: string,
		password: string,
		firstName: string,
		lastName: string,
	): Promise<User> {
		const response = await this.apiClient.post<User>("/users/", {
			email,
			password,
			first_name: firstName,
			last_name: lastName,
		});
		return response;
	}

	public storeToken(token: string, key = "token") {
		localStorage.setItem(key, token);
	}

	public logout() {
		localStorage.removeItem("token");
	}

	public get getApiClient(): ApiClient {
		return this.apiClient;
	}
}
