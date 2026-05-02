"use server";

import { revalidatePath } from "next/cache";
import { getApi } from "@/lib/api.server";

export async function createSubscription(formData: FormData) {
  const api = await getApi();

  const name = String(formData.get("name") ?? "").trim();
  const priceValue = String(formData.get("price") ?? "").trim();
  const price = Number(priceValue);
  const billingInterval = String(formData.get("billingInterval") ?? "").trim();
  const categoryValue = String(formData.get("categoryId") ?? "").trim();
  const categoryId = categoryValue ? Number(categoryValue) : null;

  if (
    !name ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !["monthly", "weekly", "yearly"].includes(billingInterval) ||
    (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0))
  ) {
    return;
  }

  await api.subscriptions.create({
    name,
    price,
    billingInterval: billingInterval as "monthly" | "weekly" | "yearly",
    categoryId,
  });

  revalidatePath("/");
}

export async function createCategory(formData: FormData) {
  const api = await getApi();

  const name = String(formData.get("name") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();

  if (!name || !icon) {
    return;
  }

  await api.categories.create({
    name,
    icon,
  });

  revalidatePath("/");
}

export async function deleteSubscription(formData: FormData) {
  const api = await getApi();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return;
  }

  await api.subscriptions.remove({ id });

  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  const api = await getApi();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return;
  }

  await api.categories.remove({ id });

  revalidatePath("/");
}
