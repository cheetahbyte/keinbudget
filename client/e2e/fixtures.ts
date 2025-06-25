import { test as base, type Page } from "@playwright/test";

type MyFixture = {
  authenticatedPage: Page;
};

export const testLoggedIn = base.extend<MyFixture>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto("/login");
    await page.getByLabel("email").fill("test@test.de");
    await page.getByLabel("password").fill("password");
    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/auth/login") && res.status() === 200,
      ),
      page.getByRole("button", { name: /Login/i }).click(),
    ]);
    await page.waitForFunction(() => localStorage.getItem("token") !== null);
    await use(page);
  },
});
