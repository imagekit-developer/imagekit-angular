import { test, expect } from "@playwright/test";

test.describe("ImageKit Transformations E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Display Tests" }).click();
  });

  test.describe("Image URL Transformation Format", () => {
    test("should format transformation string correctly", async ({ page }) => {
      const img = page.locator('ik-image img[alt="With transformation"]');
      await expect(img).toHaveAttribute("src", /tr=h-100,w-100/);
    });

    test("should handle multiple transformation parameters", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with path transformation + custom transformations"]');
      const src = await img.getAttribute("src");
      expect(src).toContain("tr:");
      expect(src).toMatch(/h-100/);
      expect(src).toMatch(/w-100/);
    });

    test("should support query-based transformations", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with queryParameters"]');
      const src = await img.getAttribute("src");
      expect(src).toContain("tr=");
    });
  });

  test.describe("Path vs Query Transformation Position", () => {
    test("should place transformations in path when specified", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with path transformation"]');
      const src = await img.getAttribute("src");
      
      // Path transformations should be in the URL path, not query string
      const url = new URL(src!);
      expect(url.pathname).toContain("/tr:");
    });

    test("should handle path transformations with custom parameters", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with path transformation + custom transformations"]');
      const src = await img.getAttribute("src");
      
      const url = new URL(src!);
      expect(url.pathname).toContain("/tr:");
      expect(url.pathname).toMatch(/h-100,w-100/);
    });

    test("should apply transformations to video as well", async ({ page }) => {
      await page.locator("h1").filter({ hasText: "Video" }).scrollIntoViewIfNeeded();
      const video = page.locator("ik-video video").nth(2);
      await expect(video).toHaveAttribute("src", /\?tr=h-100,w-100/);
    });
  });

  test.describe("Responsive Image Transformations", () => {
    test("should generate srcset with different widths", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Responsive image with sizes"]');
      const srcset = await img.getAttribute("srcset");
      
      // Should contain multiple width descriptors
      expect(srcset).toMatch(/\d+w/);
    });

    test("should respect custom device breakpoints", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Custom deviceBreakpoints"]');
      const srcset = await img.getAttribute("srcset");
      
      expect(srcset).toContain("200w");
      expect(srcset).toContain("400w");
      expect(srcset).toContain("800w");
    });

    test("should not generate srcset when responsive is disabled", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with responsive off"]').first();
      const srcset = await img.getAttribute("srcset");
      expect(srcset).toBeNull();
    });
  });

  test.describe("URL Endpoint Override", () => {
    test("should use custom urlEndpoint for images", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with urlEndpoint override"]');
      const src = await img.getAttribute("src");
      expect(src).toContain("ik.imagekit.io/demo2/");
    });

    test("should use custom urlEndpoint for videos", async ({ page }) => {
      await page.locator("h1").filter({ hasText: "Video" }).scrollIntoViewIfNeeded();
      const videos = page.locator("ik-video video");
      const count = await videos.count();
      const video = videos.nth(count - 2);
      const src = await video.getAttribute("src");
      expect(src).toContain("ik.imagekit.io/demo2/");
    });

    test("should fallback to global config when urlEndpoint not specified", async ({ page }) => {
      const img = page.locator("ik-image img").nth(1);
      const src = await img.getAttribute("src");
      expect(src).toContain("ik.imagekit.io/demo/");
    });
  });

  test.describe("Transformation Edge Cases", () => {
    test("should handle absolute URLs", async ({ page }) => {
      const img = page.locator('ik-image img[alt="path not respected with absolute url"]');
      const src = await img.getAttribute("src");
      expect(src).toMatch(/^https:\/\//);
    });

    test("should handle images without explicit width", async ({ page }) => {
      const img = page.locator('ik-image img[alt="No width"]');
      const src = await img.getAttribute("src");
      expect(src).toBeTruthy();
      expect(src).not.toBe("");
    });

    test("should handle width with non-numeric values", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with width not number, should produce larger srcset"]');
      await expect(img).toHaveAttribute("width", "300px");
      const srcset = await img.getAttribute("srcset");
      expect(srcset).toBeTruthy();
    });
  });

  test.describe("Query Parameters", () => {
    test("should append custom query parameters", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with queryParameters"]');
      const src = await img.getAttribute("src");
      
      const url = new URL(src!);
      expect(url.searchParams.get("version")).toBe("v1");
    });

    test("should preserve transformations with query parameters", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with queryParameters"]');
      const src = await img.getAttribute("src");
      
      expect(src).toContain("version=v1");
      expect(src).toContain("tr=");
    });
  });

  test.describe("Path Parameters", () => {
    test("should append custom query parameters", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with path transformation"]');
      const src = await img.getAttribute("src");
      
      const url = new URL(src!);
      expect(url.pathname).toContain("/tr:");
    });

    test("should preserve transformations with query parameters", async ({ page }) => {
      const img = page.locator('ik-image img[alt="Image with path transformation + custom transformations"]');
      const src = await img.getAttribute("src");
      
      const url = new URL(src!);
      expect(url.pathname).toContain("/tr:");
      expect(url.pathname).toContain("h-100,w-100");
    });
  });

  test.describe("URL Construction Validation", () => {
    test("should build valid URLs for all images", async ({ page }) => {
      const images = page.locator("ik-image img");
      const count = await images.count();
      
      for (let i = 0; i < count; i++) {
        const src = await images.nth(i).getAttribute("src");
        if (src) {
          // Should be a valid URL
          expect(() => new URL(src)).not.toThrow();
          // Should use HTTPS
          expect(src).toMatch(/^https:\/\//);
        }
      }
    });

    test("should build valid URLs for all videos", async ({ page }) => {
      await page.locator("h1").filter({ hasText: "Video" }).scrollIntoViewIfNeeded();
      const videos = page.locator("ik-video video");
      const count = await videos.count();
      
      for (let i = 0; i < count; i++) {
        const src = await videos.nth(i).getAttribute("src");
        if (src) {
          expect(() => new URL(src)).not.toThrow();
          expect(src).toMatch(/^https:\/\//);
        }
      }
    });
  });
});

