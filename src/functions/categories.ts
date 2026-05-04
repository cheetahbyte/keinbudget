import { createServerFn } from "@tanstack/react-start";
import { db } from "#/db";
import { ensureSession } from "#/lib/auth.functions";
import {
  createCategorySchema,
  entityIdSchema,
  updateCategorySchema,
} from "#/schemas";
import { CategoryService } from "#/services/categories";

const service = new CategoryService(db);

export const getCategories = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    return service.findAll(user.id);
  },
);

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createCategorySchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    return service.create(user.id, ctx.data);
  });

export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => updateCategorySchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    return service.update(user.id, ctx.data);
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => entityIdSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    return service.remove(user.id, ctx.data.id);
  });
