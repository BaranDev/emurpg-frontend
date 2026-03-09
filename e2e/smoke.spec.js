import { test, expect } from "@playwright/test";

// Helper: verify no React error boundary triggered and no console errors
async function expectNoRenderErrors(page) {
  // Check for React error boundary fallback text
  const errorBoundary = page.locator("text=Something went wrong");
  await expect(errorBoundary).toHaveCount(0);

  // Check for unhandled JS errors thrown before navigation completed
  const errorOverlay = page.locator("[data-testid='error-boundary']");
  await expect(errorOverlay).toHaveCount(0);
}

test.describe("Smoke: all routes render without errors", () => {
  test("/ — HomePage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/EMURPG|Emucon|Home/i);
    await expectNoRenderErrors(page);
  });

  test("/events — EventsPage loads", async ({ page }) => {
    await page.goto("/events");
    await expectNoRenderErrors(page);
    // Page should not be a 404
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/admin — AdminPage loads login form", async ({ page }) => {
    await page.goto("/admin");
    await expectNoRenderErrors(page);
    // Should show login (not logged in by default)
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/emucon — ThankYou page loads", async ({ page }) => {
    await page.goto("/emucon");
    await expectNoRenderErrors(page);
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/emucon/live — ThankYou page loads", async ({ page }) => {
    await page.goto("/emucon/live");
    await expectNoRenderErrors(page);
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/emucon/sponsors — Sponsors page loads", async ({ page }) => {
    await page.goto("/emucon/sponsors");
    await expectNoRenderErrors(page);
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/emucon/rules — Rules page loads", async ({ page }) => {
    await page.goto("/emucon/rules");
    await expectNoRenderErrors(page);
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/emucon/register/:token — ThankYou page loads", async ({ page }) => {
    await page.goto("/emucon/register/test-token-123");
    await expectNoRenderErrors(page);
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/charroller — CharrollerLanding loads", async ({ page }) => {
    await page.goto("/charroller");
    await expectNoRenderErrors(page);
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/charroller/manager — CharrollerManager loads", async ({ page }) => {
    await page.goto("/charroller/manager");
    await expectNoRenderErrors(page);
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/demo/emucon — EmuconDemoHome loads", async ({ page }) => {
    await page.goto("/demo/emucon");
    await expectNoRenderErrors(page);
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/demo/emucon/live — EmuconDemoLive loads", async ({ page }) => {
    await page.goto("/demo/emucon/live");
    await expectNoRenderErrors(page);
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/privacy — Privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expectNoRenderErrors(page);
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/table/:slug — TableDetailPage loads with unknown slug", async ({
    page,
  }) => {
    await page.goto("/table/nonexistent-table-smoke-test");
    await expectNoRenderErrors(page);
    // Should render the page shell (may show empty/error state, but not crash)
    await expect(page.locator("text=404")).toHaveCount(0);
  });

  test("/* — unknown routes render NotFound (404) page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-at-all");
    await expectNoRenderErrors(page);
    // The NotFound component should render — look for "404" or "not found" text
    const notFoundText = page
      .locator("text=/404|not found|bulunamadı/i")
      .first();
    await expect(notFoundText).toBeVisible({ timeout: 5000 });
  });
});
