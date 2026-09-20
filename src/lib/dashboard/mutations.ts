import {
  type CreateCategoryInput,
  type CreateSubscriptionInput,
  createCategorySchema,
  createSubscriptionSchema,
  entityIdSchema,
  type RemoveCategoryInput,
  type UpdateCategoryInput,
  type UpdateSubscriptionInput,
  updateCategorySchema,
  updateSubscriptionSchema,
} from "#/schemas";

interface EntryFormInput {
  name: string;
  price: number;
  billingInterval: string;
  categoryId: number | null;
  notes?: string;
  isActive?: boolean;
  nextBillingDate?: string | null;
}

function normalizeEntryInput(input: EntryFormInput) {
  return {
    ...input,
    name: input.name.trim(),
    billingInterval: input.billingInterval.trim(),
    notes: (input.notes ?? "").trim(),
    isActive: input.isActive ?? true,
    nextBillingDate: input.nextBillingDate?.trim() || null,
  };
}

function readEntryFormData(formData: FormData): EntryFormInput {
  const categoryValue = String(formData.get("categoryId") ?? "").trim();
  return {
    name: String(formData.get("name") ?? ""),
    price: Number(formData.get("price")),
    billingInterval: String(formData.get("billingInterval") ?? ""),
    categoryId: categoryValue ? Number(categoryValue) : null,
    notes: String(formData.get("notes") ?? ""),
    // A hidden "off" input precedes the switch so an unchecked state is present
    isActive: formData.has("isActive")
      ? formData.getAll("isActive").at(-1) === "on"
      : undefined,
    nextBillingDate: String(formData.get("nextBillingDate") ?? ""),
  };
}

export function validateCreateSubscriptionInput(
  input: EntryFormInput,
): CreateSubscriptionInput | null {
  const parsed = createSubscriptionSchema.safeParse(normalizeEntryInput(input));
  return parsed.success ? parsed.data : null;
}

export function parseCreateSubscriptionFormData(
  formData: FormData,
): CreateSubscriptionInput | null {
  return validateCreateSubscriptionInput(readEntryFormData(formData));
}

export function validateCreateCategoryInput(input: {
  name: string;
  icon: string;
  type: string;
}): CreateCategoryInput | null {
  const parsed = createCategorySchema.safeParse({
    name: input.name.trim(),
    icon: input.icon.trim(),
    type: input.type.trim(),
  });

  return parsed.success ? parsed.data : null;
}

export function parseCreateCategoryFormData(
  formData: FormData,
): CreateCategoryInput | null {
  return validateCreateCategoryInput({
    name: String(formData.get("name") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    type: String(formData.get("type") ?? "expense"),
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

export function validateUpdateCategoryInput(input: {
  id: number;
  name: string;
  icon: string;
  type: string;
}): UpdateCategoryInput | null {
  const parsed = updateCategorySchema.safeParse({
    id: input.id,
    name: input.name.trim(),
    icon: input.icon.trim(),
    type: input.type.trim(),
  });

  return parsed.success ? parsed.data : null;
}

export function parseUpdateCategoryFormData(
  formData: FormData,
): UpdateCategoryInput | null {
  return validateUpdateCategoryInput({
    id: Number(formData.get("id")),
    name: String(formData.get("name") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    type: String(formData.get("type") ?? "expense"),
  });
}

export function validateUpdateSubscriptionInput(
  input: EntryFormInput & { id: number },
): UpdateSubscriptionInput | null {
  const parsed = updateSubscriptionSchema.safeParse(normalizeEntryInput(input));
  return parsed.success ? parsed.data : null;
}

export function parseUpdateSubscriptionFormData(
  formData: FormData,
): UpdateSubscriptionInput | null {
  return validateUpdateSubscriptionInput({
    id: Number(formData.get("id")),
    ...readEntryFormData(formData),
  });
}
