import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Personal Trainer App/);
  await expect(page.getByRole("heading", { name: "Personal Trainer App" })).toBeVisible();
});
