import { inject, injectable } from "tsyringe";
import { CATEGORY_REPO } from "./categories.tokens";
import type { CategoryRepo } from "./categories.repo";
import type { CreateCategoryInput, RemoveCategoryInput } from "./categories.types";

@injectable()
export class CategoryService {
  constructor(@inject(CATEGORY_REPO) private readonly repo: CategoryRepo) {}

  findAll(userId: string) {
    return this.repo.findAll(userId);
  }

  create(userId: string, input: CreateCategoryInput) {
    return this.repo.create(userId, input);
  }

  remove(userId: string, input: RemoveCategoryInput) {
    return this.repo.remove(userId, input.id);
  }
}
