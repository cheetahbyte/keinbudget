import { expect, type Locator, type Page } from "@playwright/test";
import { testLoggedIn } from "./fixtures";

async function createAccount(page: Page) {
  const createAccountButton = page.getByTestId("new-acc-btn");
  await createAccountButton.click();
  await page.getByLabel("name").fill("Playwright Account");
  const inputField = page.getByTestId("startbalance");
  await expect(inputField).toBeInViewport();
  await inputField.fill("1201");
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/accounts/") &&
        res.status() === 200 &&
        res.request().method() === "POST",
    ),
    page.getByRole("button", { name: /Create Account/i }).click(),
  ]);
  expect(response.ok()).toBeTruthy();
}

testLoggedIn("can create account", async ({ authenticatedPage }) => {
  const accountTab = authenticatedPage.getByTestId("tab-accounts");
  await expect(accountTab).toBeVisible();
  await accountTab.click();

  await expect(authenticatedPage).toHaveURL(/\/accounts/);

  const createAccountButton = authenticatedPage.getByTestId("new-acc-btn");
  await expect(createAccountButton).toBeVisible();
  await createAccountButton.click();

  await expect(
    authenticatedPage.getByText("Create a new Account"),
  ).toBeVisible();
  await authenticatedPage.getByLabel("name").fill("Playwright Account");
  const inputField = authenticatedPage.getByTestId("startbalance");
  await expect(inputField).toBeInViewport();
  await inputField.fill("1201");
  const [response] = await Promise.all([
    authenticatedPage.waitForResponse(
      (res) =>
        res.url().includes("/accounts/") &&
        res.status() === 200 &&
        res.request().method() === "POST",
    ),
    authenticatedPage.getByRole("button", { name: /Create Account/i }).click(),
  ]);
  expect(response.ok()).toBeTruthy();
  const elem = authenticatedPage.getByText("Playwright Account");
  await expect(elem).toBeVisible();
});

testLoggedIn("can delete account", async ({ authenticatedPage }) => {
  const accountTab = authenticatedPage.getByTestId("tab-accounts");
  await expect(accountTab).toBeVisible();
  await accountTab.click();
  await expect(authenticatedPage).toHaveURL(/\/accounts/);
  let elem: Locator;
  try {
    elem = authenticatedPage.getByText("Playwright Account");
    await expect(elem).toBeVisible();
  } catch {
    createAccount(authenticatedPage);
    elem = authenticatedPage.getByText("Playwright Account");
    await expect(elem).toBeVisible();
  }
  const deleteButton = authenticatedPage.getByTestId("delete-account");
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
  await expect(elem).toBeVisible({ visible: false });
});
