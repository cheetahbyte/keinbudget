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
      notes: "",
      isActive: true,
      nextBillingDate: null,
    });
  });

  it("parses notes, paused state and an optional next billing date", () => {
    const formData = new FormData();
    formData.set("name", "Gym");
    formData.set("price", "30");
    formData.set("billingInterval", "monthly");
    formData.set("categoryId", "");
    formData.set("notes", " cancel before summer ");
    formData.append("isActive", "off");
    formData.set("nextBillingDate", "2026-10-01");

    expect(parseCreateSubscriptionFormData(formData)).toMatchObject({
      notes: "cancel before summer",
      isActive: false,
      nextBillingDate: "2026-10-01",
    });

    formData.append("isActive", "on");
    formData.set("nextBillingDate", "");
    expect(parseCreateSubscriptionFormData(formData)).toMatchObject({
      isActive: true,
      nextBillingDate: null,
    });

    formData.set("nextBillingDate", "01.10.2026");
    expect(parseCreateSubscriptionFormData(formData)).toBeNull();
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
      type: "expense",
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
      type: "expense",
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
      notes: "",
      isActive: true,
      nextBillingDate: null,
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
      notes: "",
      isActive: true,
      nextBillingDate: null,
    });
  });

  it("parses category form data with income or savings type", () => {
    for (const type of ["income", "savings"]) {
      const createFormData = new FormData();
      createFormData.set("name", "Type");
      createFormData.set("icon", "💡");
      createFormData.set("type", type);

      expect(parseCreateCategoryFormData(createFormData)).toEqual({
        name: "Type",
        icon: "💡",
        type,
      });

      const updateFormData = new FormData();
      updateFormData.set("id", "1");
      updateFormData.set("name", "Type");
      updateFormData.set("icon", "💡");
      updateFormData.set("type", type);

      expect(parseUpdateCategoryFormData(updateFormData)).toEqual({
        id: 1,
        name: "Type",
        icon: "💡",
        type,
      });
    }
  });

  it("rejects create category form data with invalid type", () => {
    const formData = new FormData();
    formData.set("name", "Type");
    formData.set("icon", "💡");
    formData.set("type", "investment");

    expect(parseCreateCategoryFormData(formData)).toBeNull();
  });

  it("rejects update category form data with invalid type", () => {
    const formData = new FormData();
    formData.set("id", "1");
    formData.set("name", "Type");
    formData.set("icon", "💡");
    formData.set("type", "investment");

    expect(parseUpdateCategoryFormData(formData)).toBeNull();
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
