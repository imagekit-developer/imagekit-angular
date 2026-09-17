import { test, expect } from "@playwright/test";
import { writeFileSync } from "fs";

test("CSR test case", async ({ page }) => {
  await page.goto("/csr");

  // Scroll to the bottom of the page
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await page.waitForTimeout(2000); // Wait for 2 seconds


  // Locate the output element (adjust selector as needed)
  const outputElement = page.locator('app-root');

  // Grab the entire HTML from the element
  const outputHtml = await outputElement.evaluate(el => el.outerHTML);

  // Angular stamps its exact version on the root element; normalize it so the
  // snapshot doesn't break on every Angular patch release.
  const normalizedHtml = outputHtml.replace(/ng-version="[^"]*"/g, 'ng-version="x.y.z"');

  // Compare against a stored snapshot
  expect(normalizedHtml).toMatchSnapshot();
});