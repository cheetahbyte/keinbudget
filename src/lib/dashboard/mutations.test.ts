import { describe, expect, it } from "vitest";

import {
  parseCreateCategoryFormData,
  parseCreateSubscriptionFormData,
  parseEntityIdFormData,
} from "#/lib/dashboard/mutations";

describe("dashboard mutation parsing", () => {
  it("parses valid subscription form data", () => {
    const formData = new FormData();
    formData.set("name", " Netflix ");
    formData.set("price", "9.99");
    formData.set("billingInterval", "monthly");
    formData.set("categoryId", "4");

    expect(parseCreateSubscriptionFormData(formData)).toEqual({
      name: "Netflix",
      price: 9.99,
      billingInterval: "monthly",
      categoryId: 4,
    });
  });

  it("rejects invalid subscription form data", () => {
    const formData = new FormData();
    formData.set("name", "");
    formData.set("price", "-1");
    formData.set("billingInterval", "daily");

    expect(parseCreateSubscriptionFormData(formData)).toBeNull();
  });

  it("parses trimmed category data and entity ids", () => {
    const categoryFormData = new FormData();
    categoryFormData.set("name", " Streaming ");
    categoryFormData.set("icon", " 📺 ");

    const deleteFormData = new FormData();
    deleteFormData.set("id", "3");

    expect(parseCreateCategoryFormData(categoryFormData)).toEqual({
      name: "Streaming",
      icon: "📺",
    });
    expect(parseEntityIdFormData(deleteFormData)).toEqual({ id: 3 });
  });
});
