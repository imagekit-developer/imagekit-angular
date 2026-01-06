import { test, expect, Page } from "@playwright/test";

test.describe("IKImage Component E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Switch to display tab if not already there
    await page.getByRole("button", { name: "Display Tests" }).click();
  });

  test.describe("Basic Image Rendering", () => {
    test("should render image with urlEndpoint prop", async ({ page }) => {
      const img = page.locator("ik-image img").first();
      await expect(img).toBeVisible();
      await expect(img).toHaveAttribute("src", /ik\.imagekit\.io\/demo\//);
    });

    test("should render image with alt text", async ({ page }) => {
      const img = page.locator("ik-image img").first();
      await expect(img).toHaveAttribute("alt", "Image without ImageKit provider");
    });

    test("should render image with width and height attributes", async ({ page }) => {
      const img = page.locator("ik-image img").first();
      await expect(img).toHaveAttribute("width", "300");
      await expect(img).toHaveAttribute("height", "300");
    });

    test("should load image successfully", async ({ page }) => {
      const img = page.locator("ik-image img").nth(2);
      await expect(img).toBeVisible();
      
      // Check if image has loaded by verifying naturalWidth > 0
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    });
  });

  test.describe("ImageKit Configuration", () => {
    test("should use global ImageKit provider configuration", async ({ page }) => {
      const img = page.locator("ik-image img").nth(1);
      await expect(img).toHaveAttribute("src", /ik\.imagekit\.io\/demo\//);
    });

    test("should override urlEndpoint when provided", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with urlEndpoint override"]');
      await expect(img).toHaveAttribute("src", /ik\.imagekit\.io\/demo2\//);
    });
  });

  test.describe("Image Transformations", () => {
    test("should apply transformation parameters to image URL", async ({ page }) => {
      const img = page.locator('ik-image img[alt="With transformation"]');
      await expect(img).toHaveAttribute("src", /\?tr=h-100,w-100/);
    });

    test("should apply query parameters to image URL", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with queryParameters"]');
      const src = await img.getAttribute("src");
      expect(src).toContain("version=v1");
    });

    test("should support path transformation position", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with path transformation + custom transformations"]');
      const src = await img.getAttribute("src");
      expect(src).toMatch(/tr:h-100,w-100/);
      expect(src).not.toContain("?tr=");
    });
  });

  test.describe("Responsive Images", () => {
    test("should generate srcset for responsive images", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Responsive image with sizes"]');
      const srcset = await img.getAttribute("srcset");
      expect(srcset).toBeTruthy();
      expect(srcset).not.toBe("");
    });

    test("should include sizes attribute when provided", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Responsive image with sizes"]');
      await expect(img).toHaveAttribute("sizes", "(max-width: 600px) 100vw, 50vw");
    });

    test("should not generate srcset when responsive is false", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with responsive off"]').first();
      const srcset = await img.getAttribute("srcset");
      // srcset should be null or empty string when responsive is false
      // Firefox may return empty string instead of null
      expect(srcset === null || srcset === "").toBe(true);
    });

    test("should handle custom device breakpoints", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Custom deviceBreakpoints"]');
      const srcset = await img.getAttribute("srcset");
      expect(srcset).toContain("200w");
      expect(srcset).toContain("400w");
      expect(srcset).toContain("800w");
    });
  });

  test.describe("Image Attributes", () => {
    test("should apply custom className", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with className"]');
      await expect(img).toHaveClass(/custom-class/);
    });

    test("should support eager loading", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with lazy loading eager"]');
      await expect(img).toHaveAttribute("loading", "eager");
    });

    test("should default to lazy loading", async ({ page }) => {
      const img = page.locator("ik-image img").first();
      await expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  test.describe("Passthrough Attributes", () => {
    test("should apply passthrough data attributes", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with ImageKit provider"]');
      await expect(img).toHaveAttribute("data-testid", "hero-image");
      await expect(img).toHaveAttribute("aria-describedby", "image-description");
      await expect(img).toHaveAttribute("data-track", "analytics-id");
      await expect(img).toHaveAttribute("crossorigin", "anonymous");
      await expect(img).toHaveAttribute("decoding", "async");
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle absolute URLs correctly", async ({ page }) => {
      const img = page.locator('ik-image img[alt="path not respected with absolute url"]');
      const src = await img.getAttribute("src");
      expect(src).toContain("https://ik.imagekit.io/demo/default-image.jpg");
    });

    test("should render image without width", async ({ page }) => {
      const img = page.locator('ik-image img[alt="No width"]');
      await expect(img).toBeVisible();
      const src = await img.getAttribute("src");
      expect(src).toBeTruthy();
    });

    test("should handle width as string with units", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with width not number, should produce larger srcset"]');
      await expect(img).toHaveAttribute("width", "300px");
      const srcset = await img.getAttribute("srcset");
      expect(srcset).toBeTruthy();
    });
  });

  test.describe("Image Loading and Performance", () => {
    test("should load multiple images on the page", async ({ page }) => {
      const images = page.locator("ik-image img");
      const count = await images.count();
      expect(count).toBeGreaterThan(10);
      
      // Check that all images have a src attribute
      for (let i = 0; i < count; i++) {
        const src = await images.nth(i).getAttribute("src");
        expect(src).toBeTruthy();
      }
    });

    test("should have valid ImageKit URLs", async ({ page }) => {
      const img = page.locator("ik-image img").first();
      const src = await img.getAttribute("src");
      expect(src).toContain("ik.imagekit.io");
    });
  });

  test.describe("Viewport and Responsive Behavior", () => {
    const viewports = [
      { name: "iPhone 6", width: 375, height: 667 },
      { name: "iPad", width: 768, height: 1024 },
      { name: "MacBook 15", width: 1440, height: 900 },
    ];

    for (const viewport of viewports) {
      test(`should render correctly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const img = page.locator("ik-image img").first();
        await expect(img).toBeVisible();
        const src = await img.getAttribute("src");
        expect(src).toBeTruthy();
      });
    }
  });
});

