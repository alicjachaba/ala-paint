import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function stroke(
  page,
  start = { x: 150, y: 180 },
  end = { x: 450, y: 300 },
) {
  const canvas = page.locator("#drawing");
  const box = await canvas.boundingBox();
  const dimensions = await canvas.evaluate((element) => ({
    width: element.width,
    height: element.height,
  }));
  await page.mouse.move(
    box.x + (start.x * box.width) / dimensions.width,
    box.y + (start.y * box.height) / dimensions.height,
  );
  await page.mouse.down();
  await page.mouse.move(
    box.x + (end.x * box.width) / dimensions.width,
    box.y + (end.y * box.height) / dimensions.height,
    { steps: 15 },
  );
  await page.mouse.up();
}
async function pixels(page, x = 300, y = 240) {
  return page
    .locator("#drawing")
    .evaluate(
      (canvas, point) => [
        ...canvas.getContext("2d").getImageData(point.x, point.y, 1, 1).data,
      ],
      { x, y },
    );
}
async function getDownload(page, selector) {
  await page.locator("#save-menu-toggle").click();
  const promise = page.waitForEvent("download");
  await page.locator(selector).click();
  return promise;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("rysowanie, cofanie i ponawianie zmieniają obraz", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  expect(await pixels(page)).toEqual([255, 255, 255, 255]);
  await stroke(page);
  expect(await pixels(page)).toEqual([118, 85, 206, 255]);
  await page.getByRole("button", { name: "Cofnij", exact: true }).click();
  await expect.poll(() => pixels(page)).toEqual([255, 255, 255, 255]);
  await page.getByRole("button", { name: "Ponów", exact: true }).click();
  await expect.poll(() => pixels(page)).toEqual([118, 85, 206, 255]);
  expect(errors).toEqual([]);
});

test("warstwy można ukryć, przesunąć i usunąć; gumka chroni dolną warstwę", async ({
  page,
}) => {
  await stroke(page);
  await page
    .getByRole("button", { name: "Dodaj warstwę", exact: true })
    .click();
  await page.getByRole("button", { name: "Czerwony", exact: true }).click();
  await stroke(page);
  expect(await pixels(page)).toEqual([239, 99, 99, 255]);
  await page.getByRole("button", { name: "Gumka", exact: true }).click();
  await stroke(page);
  expect(await pixels(page)).toEqual([118, 85, 206, 255]);
  await page.getByRole("button", { name: "Pędzel", exact: true }).click();
  await stroke(page);
  await page
    .getByRole("button", { name: "Ukryj: Warstwa 2", exact: true })
    .click();
  expect(await pixels(page)).toEqual([118, 85, 206, 255]);
  await page
    .getByRole("button", { name: "Pokaż: Warstwa 2", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Przesuń warstwę niżej", exact: true })
    .click();
  expect(await pixels(page)).toEqual([118, 85, 206, 255]);
  await page.getByRole("button", { name: "Usuń warstwę", exact: true }).click();
  await expect(page.locator(".layer-row")).toHaveCount(1);
  await page.getByRole("button", { name: "Cofnij", exact: true }).click();
  await expect(page.locator(".layer-row")).toHaveCount(2);
});

test("projekt JSON zachowuje obraz, warstwy, tło i nazwę", async ({ page }) => {
  await stroke(page);
  await page.locator("#project-name").fill("Kosmiczny kot Ali");
  await page.locator("#project-name").press("Tab");
  await page.getByRole("button", { name: "Miętowe", exact: true }).click();
  await page
    .getByRole("button", { name: "Dodaj warstwę", exact: true })
    .click();
  const before = await page
    .locator("#drawing")
    .evaluate((canvas) => canvas.toDataURL());
  const download = await getDownload(page, "#save-project");
  expect(download.suggestedFilename()).toBe("Kosmiczny kot Ali.ala.json");
  const path = await download.path();
  const data = JSON.parse(await readFile(path, "utf8"));
  expect(data.layers).toHaveLength(2);
  expect(data.background).toBe("mint");
  await page.getByRole("button", { name: "Nowy", exact: true }).click();
  await page.locator("#file-input").setInputFiles(path);
  await expect(page.locator("#project-name")).toHaveValue("Kosmiczny kot Ali");
  await expect(page.locator(".layer-row")).toHaveCount(2);
  expect(
    await page.locator("#drawing").evaluate((canvas) => canvas.toDataURL()),
  ).toBe(before);
});

test("eksport PNG i WebP zawiera właściwy format i przezroczystość", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Przezroczyste", exact: true })
    .click();
  await stroke(page);
  for (const format of ["png", "webp"]) {
    const download = await getDownload(page, `[data-export="${format}"]`);
    expect(download.suggestedFilename()).toMatch(new RegExp(`\\.${format}$`));
    const bytes = await readFile(await download.path());
    if (format === "png")
      expect([...bytes.subarray(0, 8)]).toEqual([
        137, 80, 78, 71, 13, 10, 26, 10,
      ]);
    else expect(bytes.subarray(8, 12).toString()).toBe("WEBP");
    const result = await page.evaluate(
      async ({ base64, format }) => {
        const image = new Image();
        image.src = `data:image/${format};base64,${base64}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        return {
          width: image.width,
          height: image.height,
          alpha: ctx.getImageData(0, 0, 1, 1).data[3],
          mark: ctx.getImageData(300, 240, 1, 1).data[3],
        };
      },
      { base64: bytes.toString("base64"), format },
    );
    expect(result).toEqual({ width: 960, height: 640, alpha: 0, mark: 255 });
  }
});

test("błędny plik nie zastępuje pracy, a nowa kartka wymaga potwierdzenia", async ({
  page,
}) => {
  await stroke(page);
  const before = await page
    .locator("#drawing")
    .evaluate((canvas) => canvas.toDataURL());
  await page.locator("#file-input").setInputFiles({
    name: "zepsuty.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"format":"ala-paint","version":999}'),
  });
  await expect(page.locator("#toast")).toContainText(
    "nie jest poprawnym projektem",
  );
  expect(
    await page.locator("#drawing").evaluate((canvas) => canvas.toDataURL()),
  ).toBe(before);
  await page.getByRole("button", { name: "Nowy", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "Wróć do rysowania", exact: true })
    .click();
  expect(await pixels(page)).toEqual([118, 85, 206, 255]);
  await page.getByRole("button", { name: "Nowy", exact: true }).click();
  await page
    .getByRole("button", { name: "Tak, zaczynamy", exact: true })
    .click();
  await expect.poll(() => pixels(page)).toEqual([255, 255, 255, 255]);
});

test("tekst i kształty trafiają na kartkę i podlegają cofaniu", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Prostokąt", exact: true }).click();
  await stroke(page, { x: 100, y: 100 }, { x: 400, y: 300 });
  expect(await pixels(page, 250, 100)).toEqual([118, 85, 206, 255]);
  await page.getByRole("button", { name: "Tekst", exact: true }).click();
  await page.getByLabel("Co napiszemy?").fill("Ala ma kota");
  const before = await page
    .locator("#drawing")
    .evaluate((canvas) => canvas.toDataURL());
  await page.locator("#drawing").click({ position: { x: 40, y: 40 } });
  expect(
    await page.locator("#drawing").evaluate((canvas) => canvas.toDataURL()),
  ).not.toBe(before);
  await page.getByRole("button", { name: "Cofnij", exact: true }).click();
  await expect
    .poll(() =>
      page.locator("#drawing").evaluate((canvas) => canvas.toDataURL()),
    )
    .toBe(before);
});

test("układ mieści się na telefonie, a dotyk rysuje", async ({
  page,
  browser,
}) => {
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const tab = await mobile.newPage();
  await tab.goto("/");
  expect(
    await tab.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const box = await tab.locator("#drawing").boundingBox();
  await tab.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  expect(await pixels(tab, 480, 320)).toEqual([118, 85, 206, 255]);
  await mobile.close();
});

test("ołówek, spray i elipsa zostawiają różne ślady na warstwie", async ({
  page,
}) => {
  for (const tool of ["Ołówek", "Spray", "Koło"]) {
    await page.getByRole("button", { name: tool, exact: true }).click();
    await stroke(page);
    const painted = await page.locator("#drawing").evaluate((canvas) => {
      const data = canvas
        .getContext("2d")
        .getImageData(0, 0, canvas.width, canvas.height).data;
      let count = 0;
      for (let index = 0; index < data.length; index += 4)
        if (data[index] !== 255) count++;
      return count;
    });
    expect(painted).toBeGreaterThan(100);
    await page.getByRole("button", { name: "Cofnij", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Cofnij", exact: true }),
    ).toBeDisabled();
  }
});

test("import odrzuca obraz o niezgodnym rozmiarze i nieznaną wersję", async ({
  page,
}) => {
  await stroke(page);
  const file = await getDownload(page, "#save-project");
  const original = JSON.parse(await readFile(await file.path(), "utf8"));
  for (const change of [{ width: 2048 }, { version: 999 }, { layers: [] }]) {
    await page.locator("#file-input").setInputFiles({
      name: "bledny.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({ ...original, ...change })),
    });
    await expect(page.locator("#toast")).toContainText(
      "nie jest poprawnym projektem",
    );
    expect(await pixels(page)).toEqual([118, 85, 206, 255]);
    await expect(page.locator(".layer-row")).toHaveCount(1);
  }
});

test("interfejs nie wychodzi poza ekran przy różnych szerokościach", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
