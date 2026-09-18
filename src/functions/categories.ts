import { createServerFn } from "@tanstack/react-start";

import { getDb } from "#/db";
import { ensureSession } from "#/lib/auth.functions";
import {
  createCategorySchema,
  entityIdSchema,
  updateCategorySchema,
} from "#/schemas";
import { CategoryService } from "#/services/categories";

export const getCategories = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();
    // Created per request: on Workers, env vars and connections only exist
    // within the request lifecycle.
    const service = new CategoryService(getDb());
    return service.findAll(user.id);
  },
);

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createCategorySchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    const service = new CategoryService(getDb());
    return service.create(user.id, ctx.data);
  });

export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => updateCategorySchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    const service = new CategoryService(getDb());
    return service.update(user.id, ctx.data);
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => entityIdSchema.parse(input))
  .handler(async (ctx) => {
    const { user } = await ensureSession();
    const service = new CategoryService(getDb());
    return service.remove(user.id, ctx.data.id);
  });
