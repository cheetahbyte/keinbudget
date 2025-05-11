import { describe, it, expect, vi } from "vitest";
import { CategoryService } from "../../src/api/services/category.service";
import type { ApiClient } from "../../src/api/api";
import type { Category } from "../../src/api/types/category";

describe("CategoryService", () => {
  it("should fetch categories", async () => {
    const expected: Category[] = [
      { id: "1", name: "Food", description: "Groceries etc." },
      { id: "2", name: "Transport", description: "Bus, train, etc." },
    ];

    const mockedApiClient = {
      get: vi.fn().mockResolvedValueOnce(expected),
    } as unknown as ApiClient;

    const service = new CategoryService(mockedApiClient);
    const result = await service.getCategories();

    expect(mockedApiClient.get).toBeCalledTimes(1);
    expect(mockedApiClient.get).toBeCalledWith("/categories/");
    expect(result).toEqual(expected);
  });

  it("should create a category with description", async () => {
    const expected: Category = {
      id: "1",
      name: "Books",
      description: "Educational and leisure",
    };

    const mockedApiClient = {
      post: vi.fn().mockResolvedValueOnce(expected),
    } as unknown as ApiClient;

    const service = new CategoryService(mockedApiClient);
    const result = await service.createCategory(
      "Books",
      "Educational and leisure"
    );

    expect(mockedApiClient.post).toBeCalledTimes(1);
    expect(mockedApiClient.post).toBeCalledWith("/categories/", {
      name: "Books",
      description: "Educational and leisure",
    });
    expect(result).toEqual(expected);
  });

  it("should create a category with empty description when not provided", async () => {
    const expected: Category = {
      id: "2",
      name: "Health",
      description: "",
    };

    const mockedApiClient = {
      post: vi.fn().mockResolvedValueOnce(expected),
    } as unknown as ApiClient;

    const service = new CategoryService(mockedApiClient);
    const result = await service.createCategory("Health");

    expect(mockedApiClient.post).toBeCalledTimes(1);
    expect(mockedApiClient.post).toBeCalledWith("/categories/", {
      name: "Health",
      description: "",
    });
    expect(result).toEqual(expected);
  });
});
