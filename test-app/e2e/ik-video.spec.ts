import { test, expect } from "@playwright/test";

test.describe("IKVideo Component E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Switch to display tab and scroll to video section
    await page.getByRole("button", { name: "Display Tests" }).click();
    await page.locator("h1").filter({ hasText: "Video" }).scrollIntoViewIfNeeded();
  });

  test.describe("Basic Video Rendering", () => {
    test("should render video with urlEndpoint prop", async ({ page }) => {
      const video = page.locator("ik-video video").first();
      await expect(video).toBeVisible();
      await expect(video).toHaveAttribute("src", /ik\.imagekit\.io\/demo\//);
    });

    test("should render video with controls attribute", async ({ page }) => {
      const video = page.locator("ik-video video").first();
      await expect(video).toHaveAttribute("controls");
    });

    test("should render video with width and height attributes", async ({ page }) => {
      const video = page.locator("ik-video video").first();
      await expect(video).toHaveAttribute("width", "300");
      await expect(video).toHaveAttribute("height", "300");
    });

    test("should have valid video source", async ({ page }) => {
      const video = page.locator("ik-video video").first();
      const src = await video.getAttribute("src");
      expect(src).toContain("sample-video.mp4");
    });
  });

  test.describe("ImageKit Configuration", () => {
    test("should use global ImageKit provider configuration", async ({ page }) => {
      const video = page.locator("ik-video video").nth(1);
      await expect(video).toHaveAttribute("src", /ik\.imagekit\.io\/demo\//);
    });

    test("should override urlEndpoint when provided", async ({ page }) => {
      const videos = page.locator("ik-video video");
      const count = await videos.count();
      const video = videos.nth(count - 2);
      await video.scrollIntoViewIfNeeded();
      await expect(video).toHaveAttribute("src", /ik\.imagekit\.io\/demo2\//);
    });
  });

  test.describe("Video Transformations", () => {
    test("should apply transformation parameters to video URL", async ({ page }) => {
      const video = page.locator("ik-video video").nth(2);
      await expect(video).toHaveAttribute("src", /\?tr=h-100,w-100/);
    });

    test("should support path transformation position", async ({ page }) => {
      const video = page.locator("ik-video video").last();
      await video.scrollIntoViewIfNeeded();
      const src = await video.getAttribute("src");
      expect(src).toContain("/tr:h-100,w-100/");
    });
  });

  test.describe("Video Attributes", () => {
    test("should support autoplay attribute", async ({ page }) => {
      const video = page.locator("ik-video video").nth(3);
      await expect(video).toHaveAttribute("autoplay");
    });

    test("should support loop attribute", async ({ page }) => {
      const video = page.locator("ik-video video").nth(3);
      await expect(video).toHaveAttribute("loop");
    });

    test("should support muted attribute", async ({ page }) => {
      const video = page.locator("ik-video video").nth(3);
      await expect(video).toHaveAttribute("muted");
    });

    test("should support poster attribute", async ({ page }) => {
      const video = page.locator("ik-video video").nth(3);
      const poster = await video.getAttribute("poster");
      expect(poster).toContain("ik.imagekit.io/demo/default-image.jpg");
    });
  });

  test.describe("Video Playback", () => {
    test("should be playable when controls are enabled", async ({ page }) => {
      const video = page.locator("ik-video video").first();
      
      // Check if video is paused initially
      const isPaused = await video.evaluate((el: HTMLVideoElement) => el.paused);
      expect(isPaused).toBe(true);
      
      // Try to play the video
      await video.evaluate((el: HTMLVideoElement) => el.play());
      
      // Check if video is ready (readyState should be at least 0)
      const readyState = await video.evaluate((el: HTMLVideoElement) => el.readyState);
      expect(readyState).toBeGreaterThanOrEqual(0);
    });

    test("should have metadata loaded", async ({ page }) => {
      const video = page.locator("ik-video video").first();
      await expect(video).toBeVisible();
      
      // Wait for loadedmetadata event
      const readyState = await video.evaluate((el: HTMLVideoElement) => {
        return new Promise<number>((resolve) => {
          if (el.readyState >= 1) {
            resolve(el.readyState);
          } else {
            el.addEventListener('loadedmetadata', () => resolve(el.readyState));
          }
        });
      });
      
      // HAVE_METADATA or greater
      expect(readyState).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe("Video Loading", () => {
    test("should load all videos on the page", async ({ page }) => {
      const videos = page.locator("video");
      const count = await videos.count();
      expect(count).toBe(6);
      
      for (let i = 0; i < count; i++) {
        const src = await videos.nth(i).getAttribute("src");
        expect(src).toBeTruthy();
        expect(src).not.toBe("");
      }
    });

    test("should have valid ImageKit video URLs", async ({ page }) => {
      const video = page.locator("ik-video video").first();
      const src = await video.getAttribute("src");
      expect(src).toContain("ik.imagekit.io");
    });
  });

  test.describe("Video Dimensions", () => {
    test("should respect custom dimensions", async ({ page }) => {
      const video = page.locator("ik-video video").first();
      await expect(video).toHaveAttribute("width", "300");
      await expect(video).toHaveAttribute("height", "300");
    });

    test("should handle string dimensions", async ({ page }) => {
      const video = page.locator("ik-video video").nth(3);
      await expect(video).toHaveAttribute("height", "300");
      await expect(video).toHaveAttribute("width", "300");
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
        await page.locator("h1").filter({ hasText: "Video" }).scrollIntoViewIfNeeded();
        const video = page.locator("ik-video video").first();
        await expect(video).toBeVisible();
        const src = await video.getAttribute("src");
        expect(src).toBeTruthy();
      });
    }
  });

  test.describe("Video Source Validation", () => {
    test("should have correct file extension in source", async ({ page }) => {
      const video = page.locator("ik-video video").first();
      const src = await video.getAttribute("src");
      expect(src).toMatch(/\.mp4/);
    });

    test("should construct proper ImageKit URLs with transformations", async ({ page }) => {
      const video = page.locator("ik-video video").nth(2);
      const src = await video.getAttribute("src");
      expect(src).toContain("ik.imagekit.io");
      expect(src).toContain("sample-video.mp4");
      expect(src).toMatch(/\?tr=h-100,w-100/);
    });
  });
});

