import { apiClientWithToken, cn } from "../src/api/utils";

describe("cn", () => {
	it("combines class names correctly", () => {
		const result = cn("p-4", "text-lg", false && "hidden", "bg-red-500");
		expect(result).toBe("p-4 text-lg bg-red-500");
	});

	it("merges tailwind classes correctly", () => {
		const result = cn("px-2", "px-4");
		expect(result).toBe("px-4");
	});
});

const createMockApiClient = () => {
	return {
		get: vi.fn(),
		post: vi.fn(),
		delete: vi.fn(),
	};
};

describe("apiClientWithToken", () => {
	const token = "test-token";
	it("returns wrapped ApiClient with token", async () => {
		const mockClient = createMockApiClient();
		const wrapped = apiClientWithToken(mockClient as any, token);

		await wrapped.get("/endpoint", { foo: "bar" });
		expect(mockClient.get).toHaveBeenCalledWith(
			"/endpoint",
			{ foo: "bar" },
			token,
		);

		await wrapped.post("/endpoint", { a: 1 });
		expect(mockClient.post).toHaveBeenCalledWith("/endpoint", { a: 1 }, token);

		await wrapped.delete("/endpoint", { id: "123" });
		expect(mockClient.delete).toHaveBeenCalledWith(
			"/endpoint",
			{ id: "123" },
			token,
		);
	});
});
