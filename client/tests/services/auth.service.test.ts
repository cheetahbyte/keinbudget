import { afterEach, describe, expect, it, vi } from "vitest";
import type { User } from "~/api/types/user";
import type { ApiClient } from "../../src/api/api";
import {
  AuthService,
  type AuthServiceTokenRequest,
} from "../../src/api/services/auth.service";

describe("AuthService", async () => {
  afterEach(() => localStorage.clear());

  it("should perform the login correctly", async () => {
    const tokenResponse: AuthServiceTokenRequest = {
      intermediate: false,
      token: "test-token",
      tokenType: "Bearer",
    };
    const mockedApiClient = {
      post: vi.fn().mockResolvedValueOnce(tokenResponse),
    } as unknown as ApiClient;
    const service = new AuthService(mockedApiClient);

    const response = await service.login("test", "test");
    expect(mockedApiClient.post).toBeCalledTimes(1);
    expect(mockedApiClient.post).toBeCalledWith("/auth/login", {
      username: "test",
      password: "test",
    });
    expect(tokenResponse).toEqual(response);
  });

  it("should perform the signUp correctly", async () => {
    const expectedResponse = {
      id: "abc",
      email: "test@test.de",
    } as unknown as User;
    const mockedApiClient = {
      post: vi.fn().mockResolvedValueOnce(expectedResponse),
    } as unknown as ApiClient;

    const service = new AuthService(mockedApiClient);
    const response = await service.signUp(
      "test@test.de",
      "password",
      "firstname",
      "lastname",
    );

    expect(mockedApiClient.post).toBeCalledTimes(1);
    expect(mockedApiClient.post).toBeCalledWith("/users/", {
      email: "test@test.de",
      password: "password",
      first_name: "firstname",
      last_name: "lastname",
    });
    expect(response).toEqual(expectedResponse);
  });

  it("should delete delete the token from localStorage on logout", () => {
    localStorage.setItem("token", "test-token");
    const service = new AuthService({} as ApiClient);
    expect(localStorage.getItem("token")).toBe("test-token");
    service.logout();
    expect(localStorage.getItem("token")).toBe(null);
  });

  it("should perform the storeToken correctly", () => {
    const service = new AuthService({} as ApiClient);
    expect(localStorage.getItem("token")).toBe(null);
    service.storeToken("test");
    expect(localStorage.getItem("token")).toBe("test");
  });

  it("should return the correct apiclient", () => {
    const apiClient = { id: "test" } as unknown as ApiClient;
    const service = new AuthService(apiClient);
    expect(service.getApiClient).toBe(apiClient);
  });
});
