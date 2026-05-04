import { describe, expect, it } from "vitest";

import {
  parseCreateCategoryFormData,
  parseCreateSubscriptionFormData,
  parseEntityIdFormData,
  parseUpdateCategoryFormData,
  parseUpdateSubscriptionFormData,
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

  it("parses update category form data", () => {
    const formData = new FormData();
    formData.set("id", "5");
    formData.set("name", " Entertainment ");
    formData.set("icon", " 🎬 ");

    expect(parseUpdateCategoryFormData(formData)).toEqual({
      id: 5,
      name: "Entertainment",
      icon: "🎬",
    });
  });

  it("parses update subscription form data", () => {
    const formData = new FormData();
    formData.set("id", "3");
    formData.set("name", " Spotify Premium ");
    formData.set("price", "12.99");
    formData.set("billingInterval", "monthly");
    formData.set("categoryId", "2");

    expect(parseUpdateSubscriptionFormData(formData)).toEqual({
      id: 3,
      name: "Spotify Premium",
      price: 12.99,
      billingInterval: "monthly",
      categoryId: 2,
    });
  });

  it("parses update subscription with no category", () => {
    const formData = new FormData();
    formData.set("id", "4");
    formData.set("name", "Netflix");
    formData.set("price", "15.99");
    formData.set("billingInterval", "monthly");
    formData.set("categoryId", "");

    expect(parseUpdateSubscriptionFormData(formData)).toEqual({
      id: 4,
      name: "Netflix",
      price: 15.99,
      billingInterval: "monthly",
      categoryId: null,
    });
  });

  it("rejects invalid update category form data", () => {
    const formData = new FormData();
    formData.set("id", "1");
    formData.set("name", "");
    formData.set("icon", "📺");

    expect(parseUpdateCategoryFormData(formData)).toBeNull();
  });

  it("rejects invalid update subscription form data", () => {
    const formData = new FormData();
    formData.set("id", "1");
    formData.set("name", "Test");
    formData.set("price", "-5");
    formData.set("billingInterval", "monthly");

    expect(parseUpdateSubscriptionFormData(formData)).toBeNull();
  });
});
