import { createServerFn } from "@tanstack/react-start";
import { createCategorySchema, entityIdSchema } from "#/schemas";
import { requireSession } from "#/server/auth/session";
import { CategoryRepo } from "./categories.repo";
import { CategoryService } from "./categories.service";

const repo = new CategoryRepo();
const service = new CategoryService(repo);

export const getCategories = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await requireSession();
    return service.findAll(user.id);
  },
);

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createCategorySchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await requireSession();
    return service.create(user.id, ctx.data);
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => entityIdSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await requireSession();
    return service.remove(user.id, ctx.data.id);
  });
