import { createContext, useContext } from "react";
import type { ApiClient } from "../api";

interface AuthServiceContextProps {
  authService: AuthService;
}
type tokenType = "Bearer";

type AuthServiceTokenRequest = {
  token: string;
  tokenType: tokenType;
  twofa: boolean;
};

export const AuthServiceContext = createContext<
  AuthServiceContextProps | undefined
>(undefined);

export const useAuth = (): AuthService => {
  const context = useContext(AuthServiceContext);
  if (!context)
    throw new Error("useAuth must be used within a AuthServiceProvider");
  return context.authService;
};

export class AuthService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async login(email: string, password: string): Promise<AuthServiceTokenRequest> {
    const response = await this.apiClient.post<AuthServiceTokenRequest>("/auth/login", {
        email,
        password,
      })
    return response;
  }

  public storeToken(token: string, key: string = "token") {
    localStorage.setItem(key, token)
  }

  public logout() {
    localStorage.clear()
  }
  
  public get getApiClient(): ApiClient {
    return this.apiClient
  }
}
