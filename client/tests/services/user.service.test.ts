import { describe, expect, it, vi } from "vitest";
import type { ApiClient } from "../../src/api/api";
import { UserService } from "../../src/api/services/user.service";
import type { User } from "../../src/api/types/user";

describe("UserService", () => {
	it("should fetch the current user with getMe()", async () => {
		const mockUser: User = {
			id: "123",
			firstName: "Test",
			lastName: "User",
			email: "test@example.com",
		} as User;

		const mockedApiClient = {
			get: vi.fn().mockResolvedValueOnce(mockUser),
		} as unknown as ApiClient;

		const service = new UserService(mockedApiClient);
		const result = await service.getMe();

		expect(mockedApiClient.get).toBeCalledTimes(1);
		expect(mockedApiClient.get).toBeCalledWith("/users/me");
		expect(result).toEqual(mockUser);
	});
});
