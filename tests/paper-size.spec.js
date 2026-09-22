import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function layout(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector("#drawing");
    const box = canvas.getBoundingClientRect();
    const space = document
      .querySelector(".paper-space")
      .getBoundingClientRect();
    return {
      imageWidth: canvas.width,
      imageHeight: canvas.height,
      toolsWidth: document.querySelector(".tools-panel").getBoundingClientRect()
        .width,
      toolsHeight: document
        .querySelector(".tools-panel")
        .getBoundingClientRect().height,
      width: box.width,
      height: box.height,
      spaceWidth: space.width,
      spaceHeight: space.height,
      pageWidth: document.documentElement.scrollWidth,
      pageHeight: document.documentElement.scrollHeight,
    };
  });
}

function expectFilledSpace(size) {
  expect(Math.abs(size.width - size.spaceWidth)).toBeLessThan(2);
  expect(Math.abs(size.height - size.spaceHeight)).toBeLessThan(2);
}

function expectFittedSpace(size) {
  expect(size.width).toBeLessThanOrEqual(size.spaceWidth + 1);
  expect(size.height).toBeLessThanOrEqual(size.spaceHeight + 1);
  expect(
    Math.min(
      Math.abs(size.width - size.spaceWidth),
      Math.abs(size.height - size.spaceHeight),
    ),
  ).toBeLessThan(2);
  expect(size.width / size.height).toBeCloseTo(
    size.imageWidth / size.imageHeight,
    2,
  );
}

async function imageOf(page) {
  return page.locator("#drawing").evaluate((canvas) => canvas.toDataURL());
}

async function download(page, selector) {
  await page.locator("#save-menu-toggle").click();
  const ready = page.waitForEvent("download");
  await page.locator(selector).click();
  return (await ready).path();
}

for (const density of [1, 2]) {
  test.describe(`kartka przy gęstości ${density}`, () => {
    test.use({
      viewport: { width: 1408, height: 650 },
      deviceScaleFactor: density,
      hasTouch: true,
    });

    test("otwarty rysunek dopasowuje się do wysokości i szerokości okna", async ({
      page,
    }) => {
      await page.goto("/");
      const legacy = await page.evaluate(async () => {
        const { newProject, serialize } = await import("/src/project.js");
        return serialize(newProject({ width: 960, height: 640 }));
      });
      await page.locator("#file-input").setInputFiles({
        name: "rysunek.ala.json",
        mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify(legacy)),
      });
      await expect(page.locator("#drawing")).toHaveJSProperty("width", 960);
      for (const height of [650, 500, 900]) {
        await page.setViewportSize({ width: 1408, height });
        const size = await layout(page);
        expectFittedSpace(size);
        expect(size.pageHeight).toBe(height);
        expect(size.width / size.height).toBeCloseTo(1.5, 2);
        expect(size.width).toBeGreaterThan(size.toolsWidth);
        expect([size.imageWidth, size.imageHeight]).toEqual([960, 640]);
        await expect(page.locator("#zoom, #dimensions")).toHaveCount(0);
      }
    });

    test("zmiana okna zachowuje projekt, historię i trafienie dotykiem przy brzegu", async ({
      page,
    }) => {
      await page.goto("/");
      await page.locator("#add-layer").click();
      await page.getByRole("button", { name: "Miętowe", exact: true }).click();
      const canvas = page.locator("#drawing");
      const original = await imageOf(page);
      const saved = JSON.parse(
        await readFile(await download(page, "#save-project"), "utf8"),
      );
      let previousHeight = (await layout(page)).height;
      for (const [width, height] of [
        [1408, 500],
        [1408, 900],
        [390, 844],
        [844, 390],
        [1920, 1080],
      ]) {
        await page.setViewportSize({ width, height });
        const size = await layout(page);
        expectFittedSpace(size);
        expect(Math.abs(size.height - previousHeight)).toBeGreaterThan(10);
        previousHeight = size.height;
        expect(size.pageWidth).toBe(width);
        if (width > 900) expect(size.pageHeight).toBe(height);
        expect([size.imageWidth, size.imageHeight]).toEqual([
          saved.width,
          saved.height,
        ]);
        expect(await imageOf(page)).toBe(original);
        await canvas.scrollIntoViewIfNeeded();
        const box = await canvas.boundingBox();
        await page.touchscreen.tap(
          box.x + box.width * 0.92,
          box.y + box.height * 0.92,
        );
        const painted = await imageOf(page);
        expect(painted).not.toBe(original);
        expect(
          await canvas.evaluate((element) => [
            ...element
              .getContext("2d")
              .getImageData(
                Math.floor(element.width * 0.92),
                Math.floor(element.height * 0.92),
                1,
                1,
              ).data,
          ]),
        ).toEqual([118, 85, 206, 255]);
        await page.locator("#undo").click();
        await expect.poll(() => imageOf(page)).toBe(original);
        await page.locator("#redo").click();
        await expect.poll(() => imageOf(page)).toBe(painted);
        await page.locator("#undo").click();
        await expect.poll(() => imageOf(page)).toBe(original);
      }
      // Zmiany okna nie dodają kroków historii: dalej cofamy wybór tła.
      await page.locator("#undo").click();
      await expect(
        page.getByRole("button", { name: "Białe", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await page.locator("#redo").click();
      await expect.poll(() => imageOf(page)).toBe(original);
      const after = JSON.parse(
        await readFile(await download(page, "#save-project"), "utf8"),
      );
      expect(after).toEqual(saved);
    });

    test("wypełnia miejsce, rysuje i zachowuje rozdzielczość w plikach oraz po zmianie okna", async ({
      page,
    }) => {
      await page.goto("/");
      await expect(page.locator("#drawing")).toBeVisible();
      const size = await layout(page);
      expectFilledSpace(size);
      expect(Math.abs(size.width - 1408 * 0.6)).toBeLessThan(2);
      expect(size.width).toBeGreaterThan(size.toolsWidth);
      expect(size.height).toBeLessThan(size.toolsHeight);
      expect(size.imageWidth).toBe(Math.floor(size.spaceWidth * density));
      expect(size.imageHeight).toBe(Math.floor(size.spaceHeight * density));
      expect(size.pageWidth).toBe(1408);
      expect(size.pageHeight).toBe(650);
      await expect(page.locator("#zoom, #dimensions")).toHaveCount(0);
      const blank = await imageOf(page);
      const canvas = page.locator("#drawing");
      await canvas.scrollIntoViewIfNeeded();
      const box = await canvas.boundingBox();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, {
        steps: 10,
      });
      await page.mouse.up();
      const thickness = await canvas.evaluate((element) => {
        const ctx = element.getContext("2d");
        const x = Math.floor(element.width / 2);
        let painted = 0;
        for (let y = 0; y < element.height; y++) {
          const color = ctx.getImageData(x, y, 1, 1).data;
          if (color[0] < 200 && color[3] === 255) painted++;
        }
        return painted;
      });
      expect(thickness / density).toBeGreaterThanOrEqual(11);
      expect(thickness / density).toBeLessThanOrEqual(13);
      // Dotyk trafia we właściwe miejsce również blisko prawego dolnego brzegu.
      await page.touchscreen.tap(
        box.x + box.width * 0.95,
        box.y + box.height * 0.9,
      );
      expect(
        await canvas.evaluate(
          (element) =>
            element
              .getContext("2d")
              .getImageData(
                Math.floor(element.width * 0.95),
                Math.floor(element.height * 0.9),
                1,
                1,
              ).data[0],
        ),
      ).toBeLessThan(200);
      await page.locator("#undo").click();
      await page.locator("#undo").click();
      await expect.poll(() => imageOf(page)).toBe(blank);
      await page.locator("#redo").click();
      await page.locator("#redo").click();
      await page.locator("#add-layer").click();
      await page.getByRole("button", { name: "Miętowe", exact: true }).click();
      const drawing = await imageOf(page);
      const path = await download(page, "#save-project");
      const project = JSON.parse(await readFile(path, "utf8"));
      expect(project.version).toBe(2);
      expect(project.pixelRatio).toBe(density);
      expect(project.layers).toHaveLength(2);
      expect(project.background).toBe("mint");
      expect([project.width, project.height]).toEqual([
        size.imageWidth,
        size.imageHeight,
      ]);
      for (const format of ["png", "webp"]) {
        const supported = await page.evaluate(async (format) => {
          const canvas = document.createElement("canvas");
          const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, `image/${format}`),
          );
          return blob?.type === `image/${format}`;
        }, format);
        if (!supported) {
          await page.locator("#save-menu-toggle").click();
          await page.locator(`[data-export="${format}"]`).click();
          await expect(page.locator("#toast")).toContainText(
            `nie potrafi zapisać ${format.toUpperCase()}`,
          );
          continue;
        }
        const bytes = await readFile(
          await download(page, `[data-export="${format}"]`),
        );
        const dimensions = await page.evaluate(
          async ({ base64, format }) => {
            const image = new Image();
            image.src = `data:image/${format};base64,${base64}`;
            await image.decode();
            return [image.width, image.height];
          },
          { base64: bytes.toString("base64"), format },
        );
        expect(dimensions).toEqual([project.width, project.height]);
      }
      await page.setViewportSize({ width: 1920, height: 1080 });
      expect(await imageOf(page)).toBe(drawing);
      const resized = await layout(page);
      expectFittedSpace(resized);
      expect(resized.width).toBeGreaterThan(size.width);
      expect(resized.width / resized.height).toBeCloseTo(
        project.width / project.height,
        2,
      );
      // Nowy projekt dostaje nowe proporcje; istniejący nie traci pikseli przy zmianie okna.
      await page.locator("#new").click();
      const fresh = await layout(page);
      expectFilledSpace(fresh);
      expect([fresh.imageWidth, fresh.imageHeight]).not.toEqual([
        project.width,
        project.height,
      ]);
      await page.locator("#file-input").setInputFiles(path);
      await expect.poll(() => imageOf(page)).toBe(drawing);
      await expect(page.locator(".layer-row")).toHaveCount(2);
    });
  });
}

test("nowe kartki mają proporcje miejsca na telefonie, laptopie i dużym ekranie", async ({
  page,
}) => {
  for (const [width, height] of [
    [390, 844],
    [1024, 600],
    [1408, 560],
    [1600, 700],
    [1440, 900],
    [1882, 1004],
    [1920, 1080],
    [2256, 1000],
    [2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.locator("#drawing")).toBeVisible();
    const size = await layout(page);
    expectFilledSpace(size);
    expect(size.pageWidth).toBe(width);
    if (width > 900) {
      const fraction = width < 1200 ? 0.5 : 0.6;
      // Sprawdzamy rozmiar względem okna, nie tylko wypełnienie kontenera.
      expect(Math.abs(size.width - width * fraction)).toBeLessThan(2);
      expect(size.width).toBeGreaterThan(size.toolsWidth);
      expect(size.height).toBeLessThan(size.toolsHeight);
      expect(size.pageHeight).toBe(height);
      const edges = await page.evaluate(() => {
        const footer = document.querySelector("footer").getBoundingClientRect();
        return {
          footerBottom: footer.bottom,
          panelsBottom: Math.max(
            ...[".tools-panel", ".details-panel"].map(
              (selector) =>
                document.querySelector(selector).getBoundingClientRect().bottom,
            ),
          ),
          footerTop: footer.top,
          frameTop: document
            .querySelector(".canvas-surround")
            .getBoundingClientRect().top,
          frameBottom: document
            .querySelector(".canvas-surround")
            .getBoundingClientRect().bottom,
          headerBottom: document
            .querySelector(".topbar")
            .getBoundingClientRect().bottom,
          paperBottom: document
            .querySelector("#drawing")
            .getBoundingClientRect().bottom,
        };
      });
      expect(edges.footerBottom).toBeLessThanOrEqual(height);
      expect(edges.panelsBottom).toBeLessThanOrEqual(edges.footerTop);
      expect(edges.paperBottom).toBeLessThan(edges.footerTop);
      // Kartka wykorzystuje odzyskane miejsce nad i pod ramką.
      expect(edges.frameTop - edges.headerBottom).toBeLessThanOrEqual(10);
      expect(edges.footerTop - edges.frameBottom).toBeLessThan(12);
      await expect(page.locator(".canvas-surround #undo")).toHaveText("Cofnij");
      await expect(page.locator(".canvas-surround #redo")).toHaveText("Ponów");
    }
  }
});

test("duży ekran Retina zostawia pamięć na 12 warstw i zapisuje poprawny projekt", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 3840, height: 2160 },
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    for (let i = 1; i < 12; i++) await page.locator("#add-layer").click();
    await expect(page.locator(".layer-row")).toHaveCount(12);
    await expect(page.locator("#add-layer")).toBeDisabled();
    const path = await download(page, "#save-project");
    const project = JSON.parse(await readFile(path, "utf8"));
    expect(project.width).toBeLessThanOrEqual(2048);
    expect(project.height).toBeLessThanOrEqual(2048);
    expect(project.width * project.height * 12).toBeLessThanOrEqual(20_000_000);
    await page.locator("#new").click();
    await page.locator("#file-input").setInputFiles(path);
    await expect(page.locator(".layer-row")).toHaveCount(12);
  } finally {
    await context.close();
  }
});

test("import wersji 1 działa, a błędna gęstość w wersji 2 nie zastępuje pracy", async ({
  page,
}) => {
  await page.goto("/");
  const legacy = await page.evaluate(async () => {
    const { newProject, serialize } = await import("/src/project.js");
    const project = newProject({ width: 960, height: 640 });
    const ctx = project.layers[0].canvas.getContext("2d");
    ctx.fillStyle = "#7655ce";
    ctx.fillRect(100, 100, 200, 200);
    const data = serialize(project);
    data.version = 1;
    delete data.pixelRatio;
    return data;
  });
  const openData = (data) =>
    page.locator("#file-input").setInputFiles({
      name: "projekt.ala.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(data)),
    });
  await openData(legacy);
  await expect(page.locator("#drawing")).toHaveJSProperty("width", 960);
  await expect(page.locator("#drawing")).toHaveJSProperty("height", 640);
  const before = await imageOf(page);
  const project = JSON.parse(
    await readFile(await download(page, "#save-project"), "utf8"),
  );
  expect(project.version).toBe(2);
  expect(project.pixelRatio).toBe(1);
  for (const pixelRatio of [0, -1, null, "2", 5]) {
    await openData({ ...project, pixelRatio });
    await expect(page.locator("#toast")).toContainText(
      "nie jest poprawnym projektem",
    );
    expect(await imageOf(page)).toBe(before);
  }
});
