import { CategoryRepo } from "./categories.repo";

export class CategoryService {
  constructor(private readonly repo: CategoryRepo) {}

  findAll(userId: string) {
    return this.repo.findAll(userId);
  }

  create(userId: string, input: { name: string; icon: string }) {
    return this.repo.create(userId, input);
  }

  remove(userId: string, id: number) {
    return this.repo.remove(userId, id);
  }
}
