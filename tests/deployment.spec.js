import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

// Serwujemy źródła tak jak GitHub Pages: bez Vite, node_modules i katalogu dist.
const root = fileURLToPath(new URL("../", import.meta.url));
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
};

for (const prefix of ["/", "/ala-paint/"]) {
  test(`źródła działają bez budowania pod ${prefix}`, async ({ page }) => {
    const server = createServer(async (request, response) => {
      const pathname = new URL(request.url, "http://localhost").pathname;
      if (!pathname.startsWith(prefix)) {
        response.writeHead(404).end();
        return;
      }
      const relative = pathname.slice(prefix.length) || "index.html";
      const file = resolve(root, relative);
      if (
        !file.startsWith(resolve(root) + sep) ||
        !/^(index\.html$|src\/|assets\/)/.test(relative)
      ) {
        response.writeHead(404).end();
        return;
      }
      try {
        const bytes = await readFile(file);
        response
          .writeHead(200, {
            "Content-Type": types[extname(file)] || "text/plain",
          })
          .end(bytes);
      } catch {
        response.writeHead(404).end();
      }
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const errors = [];
    const paths = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => errors.push(request.url()));
    page.on("request", (request) => {
      if (request.url().startsWith(origin)) {
        paths.push(new URL(request.url()).pathname);
      }
    });
    page.on("response", (response) => {
      if (response.status() >= 400) errors.push(response.url());
    });

    try {
      await page.goto(`${origin}${prefix}`, { waitUntil: "networkidle" });
      await expect(page.locator("#open svg")).toBeVisible();
      const canvas = page.locator("#drawing");
      const box = await canvas.boundingBox();
      await page.mouse.move(box.x + box.width / 4, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        box.x + (3 * box.width) / 4,
        box.y + box.height / 2,
        {
          steps: 10,
        },
      );
      await page.mouse.up();
      const pixel = () =>
        canvas.evaluate((element) => [
          ...element.getContext("2d").getImageData(480, 320, 1, 1).data,
        ]);
      expect(await pixel()).toEqual([118, 85, 206, 255]);
      await page.getByRole("button", { name: "Cofnij", exact: true }).click();
      expect(await pixel()).toEqual([255, 255, 255, 255]);
      await page.getByRole("button", { name: "Ponów", exact: true }).click();
      await page
        .getByRole("button", { name: "Dodaj warstwę", exact: true })
        .click();
      const before = await canvas.evaluate((element) => element.toDataURL());
      await page.locator("#save-menu-toggle").click();
      const downloading = page.waitForEvent("download");
      await page.locator("#save-project").click();
      const path = await (await downloading).path();
      expect(JSON.parse(await readFile(path, "utf8")).layers).toHaveLength(2);
      await page.getByRole("button", { name: "Nowy", exact: true }).click();
      await page.locator("#file-input").setInputFiles(path);
      await expect(page.locator(".layer-row")).toHaveCount(2);
      expect(await canvas.evaluate((element) => element.toDataURL())).toBe(
        before,
      );
      await page
        .getByRole("button", { name: "Tryb ciemny", exact: true })
        .click();
      await expect(page.locator("#sleep-screen img")).toBeVisible();
      expect(
        await page
          .locator("#sleep-screen img")
          .evaluate((img) => img.complete && img.naturalWidth > 0),
      ).toBe(true);
      expect(
        await page.evaluate(async () => {
          const icon = document.querySelector('link[rel="icon"]');
          return (await fetch(icon.href)).ok;
        }),
      ).toBe(true);
      expect(paths.some((path) => path.endsWith("/decorations.svg"))).toBe(
        true,
      );
      expect(paths.every((path) => path.startsWith(prefix))).toBe(true);
      expect(errors).toEqual([]);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
}
