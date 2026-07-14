import { expect, test } from "@playwright/test";

test("employer hub presents accurate plans and preserves selection", async ({ page }) => {
  await page.goto("/employers");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hire for the work");
  await expect(page.getByText("$15 Basic")).toBeVisible();
  await expect(page.getByText("$25 Featured")).toBeVisible();
  await expect(page.getByText("60 days", { exact: true }).first()).toBeVisible();

  const featured = page.getByRole("link", { name: /Choose Featured/ });
  await expect(featured).toHaveAttribute("href", /plan=featured/);
});

test("employer navigation and niche discovery are usable on mobile", async ({ page }) => {
  await page.goto("/employers");
  await expect(page.getByRole("link", { name: /Greenhouse|Nursery/i }).first()).toBeVisible();
  await page.getByRole("link", { name: /Greenhouse|Nursery/i }).first().click();
  await expect(page).toHaveURL(/hire-greenhouse-nursery-workers/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("passwordless sign-in page does not request a password", async ({ page }) => {
  await page.goto("/employer/login");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/employer/i);
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
});
