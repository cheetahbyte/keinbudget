import { expect, test } from "@playwright/test";
import { testLoggedIn } from "./fixtures";

test("can login with credentials", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("email").fill("test@test.de");
  await page.getByLabel("password").fill("password");
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes("/auth/login") && res.status() === 200,
    ),
    page.getByRole("button", { name: /Login/i }).click(),
  ]);

  expect(response.ok()).toBeTruthy();
  await page.waitForFunction(() => localStorage.getItem("token") !== null);

  await expect(page).toHaveURL(/\//);
});

test("redirects to login when not authenticated", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});

testLoggedIn("can log out", async ({ authenticatedPage }) => {
  const userDropdown = authenticatedPage.getByTestId("user-dropdown");
  await expect(userDropdown).toBeVisible();
  await userDropdown.click();

  const dropdown = authenticatedPage.getByText("test@test.de");
  await expect(dropdown).toBeVisible();

  const logoutButton = authenticatedPage.getByTestId("logout-btn");
  await expect(logoutButton).toBeVisible();
  await logoutButton.click();

  expect(
    await authenticatedPage.evaluate(() => localStorage.getItem("token")),
  ).toBeNull();
  await expect(authenticatedPage).toHaveURL(/\/login/);
});
