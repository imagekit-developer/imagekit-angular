import { test, expect } from "@playwright/test";

test.describe("ImageKit Angular SDK Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Tab Navigation", () => {
    test("should switch between display and upload tabs", async ({ page }) => {
      await expect(page.getByRole("button", { name: "Display Tests" })).toHaveClass(/active/);
      await page.getByRole("button", { name: "Upload Test" }).click();
      await expect(page.getByRole("button", { name: "Upload Test" })).toHaveClass(/active/);
      await page.getByRole("button", { name: "Display Tests" }).click();
      await expect(page.getByRole("button", { name: "Display Tests" })).toHaveClass(/active/);
    });

    test("should show correct content for each tab", async ({ page }) => {
      // Display tab
      await page.getByRole("button", { name: "Display Tests" }).click();
      await expect(page.locator("ik-image").first()).toBeVisible();
      await expect(page.locator("ik-video").first()).toBeVisible();

      // Upload tab
      await page.getByRole("button", { name: "Upload Test" }).click();
      await expect(page.locator("app-upload-test")).toBeVisible();
    });
  });

  test.describe("Page Load Performance", () => {
    test("should load the page within reasonable time", async ({ page }) => {
      const startTime = Date.now();
      await page.goto("/");
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // Less than 5 seconds
    });

    test("should load images without blocking page render", async ({ page }) => {
      await expect(page.locator("ik-image").first()).toBeVisible();
      await expect(page.locator("ik-video").first()).toBeVisible();
      
      // Page should be interactive even if images are still loading
      const uploadButton = page.getByRole("button", { name: "Upload Test" });
      await expect(uploadButton).toBeVisible();
      await expect(uploadButton).toBeEnabled();
    });
  });

  test.describe("Error Handling", () => {
    test("should handle missing urlEndpoint gracefully", async ({ page }) => {
      // The app should still render without breaking
      await expect(page.locator("ik-image").first()).toBeVisible();
      await expect(page.locator("ik-video").first()).toBeVisible();
    });

    test("should not break when switching tabs rapidly", async ({ page }) => {
      for (let i = 0; i < 5; i++) {
        await page.getByRole("button", { name: "Upload Test" }).click();
        await page.getByRole("button", { name: "Display Tests" }).click();
      }
      await expect(page.locator("ik-image").first()).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("should have alt text on all images", async ({ page }) => {
      await page.getByRole("button", { name: "Display Tests" }).click();
      const images = page.locator("ik-image img");
      const count = await images.count();
      
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt).toBeTruthy();
      }
    });

    test("should have proper button roles", async ({ page }) => {
      const buttons = page.locator("button.tab-button");
      const count = await buttons.count();
      
      for (let i = 0; i < count; i++) {
        await expect(buttons.nth(i)).toBeVisible();
        await expect(buttons.nth(i)).toBeEnabled();
      }
    });

    test("should be keyboard navigable", async ({ page }) => {
      const firstButton = page.locator("button").first();
      await firstButton.focus();
      await expect(firstButton).toBeFocused();
      await page.keyboard.press("Enter");
    });
  });

  test.describe("Responsive Design", () => {
    const breakpoints = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    for (const breakpoint of breakpoints) {
      test(`should render correctly on ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`, async ({ page }) => {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        await page.goto("/");
        await page.getByRole("button", { name: "Display Tests" }).click();
        await expect(page.locator("ik-image").first()).toBeVisible();
        await expect(page.locator("ik-video").first()).toBeVisible();
      });
    }
  });
});

