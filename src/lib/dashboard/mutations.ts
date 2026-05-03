import {
  type CreateCategoryInput,
  type CreateSubscriptionInput,
  createCategorySchema,
  createSubscriptionSchema,
  entityIdSchema,
  type RemoveCategoryInput,
} from "#/schemas";

export function validateCreateSubscriptionInput(input: {
  name: string;
  price: number;
  billingInterval: string;
  categoryId: number | null;
}): CreateSubscriptionInput | null {
  const parsed = createSubscriptionSchema.safeParse({
    ...input,
    name: input.name.trim(),
    billingInterval: input.billingInterval.trim(),
  });

  return parsed.success ? parsed.data : null;
}

export function parseCreateSubscriptionFormData(
  formData: FormData,
): CreateSubscriptionInput | null {
  const categoryValue = String(formData.get("categoryId") ?? "").trim();

  return validateCreateSubscriptionInput({
    name: String(formData.get("name") ?? ""),
    price: Number(formData.get("price")),
    billingInterval: String(formData.get("billingInterval") ?? ""),
    categoryId: categoryValue ? Number(categoryValue) : null,
  });
}

export function validateCreateCategoryInput(input: {
  name: string;
  icon: string;
}): CreateCategoryInput | null {
  const parsed = createCategorySchema.safeParse({
    name: input.name.trim(),
    icon: input.icon.trim(),
  });

  return parsed.success ? parsed.data : null;
}

export function parseCreateCategoryFormData(
  formData: FormData,
): CreateCategoryInput | null {
  return validateCreateCategoryInput({
    name: String(formData.get("name") ?? ""),
    icon: String(formData.get("icon") ?? ""),
  });
}

export function validateEntityIdInput(id: number): RemoveCategoryInput | null {
  const parsed = entityIdSchema.safeParse({ id });
  return parsed.success ? parsed.data : null;
}

export function parseEntityIdFormData(
  formData: FormData,
): RemoveCategoryInput | null {
  return validateEntityIdInput(Number(formData.get("id")));
}
