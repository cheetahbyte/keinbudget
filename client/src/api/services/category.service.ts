import type { ApiClient } from "../api";
import type { Category } from "../types/category";

export class CategoryService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async getCategories(): Promise<Category[]> {
    return await this.apiClient.get<Category[]>("/categories/");
  }

  public async createCategory(
    name: string,
    description?: string,
    icon?: string,
  ): Promise<Category> {
    return await this.apiClient.post<Category>("/categories/", {
      name,
      description: description ?? "",
      icon,
    });
  }

  public async deleteCategory(id: string) {
    await this.apiClient.delete(`/categories/${id}`);
  }
}
