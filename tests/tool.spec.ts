import { expect, test } from "@playwright/test";
import { createExternalRequestGuard } from "../src/lib/network-guard";

test("script setup and teleprompter playback stay local", async ({
  page,
  baseURL,
}) => {
  if (!baseURL) throw new Error("Playwright baseURL is required.");
  const networkGuard = createExternalRequestGuard(baseURL);
  page.on("request", (request) => networkGuard.inspect(request.url()));

  await page.goto("/");
  const script = Array.from(
    { length: 40 },
    (_, index) => `Reading line ${index + 1} keeps the presentation moving.`,
  ).join("\n");
  await page.getByRole("textbox", { name: "Script text" }).fill(script);
  await page.getByRole("combobox", { name: "Start countdown" }).selectOption("0");
  await page.getByRole("slider", { name: "Font size" }).fill("72");
  await page.getByRole("button", { name: /Mirror text/u }).click();

  const stageScript = page.locator(".teleprompter-script");
  await expect(stageScript).toHaveClass(/mirrored/u);
  await expect(stageScript).toHaveCSS("font-size", "72px");
  await page.getByRole("button", { name: "Play" }).click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(() =>
        sessionStorage.getItem("teleprompter:script:v1"),
      ),
    )
    .toBe(script);
  networkGuard.assertNoExternalRequests();
});
