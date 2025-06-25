import type { ApiClient } from "../api";
import type { User } from "../types/user";

export class UserService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async getMe(): Promise<User> {
    return await this.apiClient.get<User>("/users/me");
  }
}
