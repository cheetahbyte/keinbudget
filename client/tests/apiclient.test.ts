import { describe, it, vi, expect, beforeEach } from "vitest";
import { ApiClient } from "../src/api/api";

global.fetch = vi.fn();

const mockResponse = (data: any, ok = true, status = 200) =>
	Promise.resolve({
		ok,
		status,
		json: () => Promise.resolve(data),
		statusText: ok ? "OK" : "Error",
	});

vi.mock("../utils/camelize", () => ({
	camelize: (d: any) => d,
}));

describe("ApiClient", () => {
	const client = new ApiClient();

	beforeEach(() => {
		vi.clearAllMocks();
		(fetch as any).mockClear();
	});

	it("sends GET request with correct headers and query", async () => {
		(fetch as any).mockImplementation(() => mockResponse({ message: "hello" }));
		const result = await client.get("/test", { foo: "bar" }, "abc123");
		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining("/test?foo=bar"),
			expect.objectContaining({
				method: "GET",
				headers: expect.any(Headers),
			}),
		);
		expect(result).toEqual({ message: "hello" });
	});

	it("sends POST request with body", async () => {
		(fetch as any).mockImplementation(() => mockResponse({ success: true }));

		const result = await client.post("/submit", { name: "Leon" }, "token123");

		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining("/submit"),
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ name: "Leon" }),
			}),
		);

		expect(result).toEqual({ success: true });
	});

	it("sends DELETE request with correct headers and query", async () => {
		(fetch as any).mockImplementation(() => mockResponse({ deleted: true }));

		const result = await client.delete(
			"/items/123",
			{ reason: "test" },
			"token-abc",
		);

		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining("/items/123?reason=test"),
			expect.objectContaining({
				method: "DELETE",
				headers: expect.any(Headers),
			}),
		);

		expect(result).toEqual({ deleted: true });
	});

	it("throws error if response is not ok", async () => {
		(fetch as any).mockImplementation(() => mockResponse({}, false, 500));

		await expect(() =>
			client.get("/fail", undefined, "badtoken"),
		).rejects.toThrow("Error: Error");
	});
});
