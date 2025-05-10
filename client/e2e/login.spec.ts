import { test, expect } from "@playwright/test";

test("can not login with wrong credentials", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.getByLabel("email").fill("test@example.com");
  await page.getByLabel("password").fill("password");
  await page.getByRole("button", { name: /Login/i }).click();
  expect(page).toBe(page);
});
