import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function stroke(
  page,
  start = { x: 150, y: 180 },
  end = { x: 450, y: 300 },
) {
  const canvas = page.locator("#drawing");
  await canvas.scrollIntoViewIfNeeded();
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

// Stały projekt pozwala porównywać znane miejsca kresek i ziarenek piasku.
// Rozmiar nowych kartek zależny od okna sprawdzamy osobno w paper-size.spec.js.
async function openExampleProject(page) {
  const data = await page.evaluate(async () => {
    const { newProject, serialize } = await import("/src/project.js");
    return serialize(newProject({ width: 960, height: 640 }));
  });
  await page.locator("#file-input").setInputFiles({
    name: "przyklad.ala.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await expect(page.locator("#drawing")).toHaveJSProperty("width", 960);
  await expect(page.locator("#drawing")).toHaveJSProperty("height", 640);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await openExampleProject(page);
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
  await page.locator("#save-menu-toggle").click();
  await page.locator("#project-name").fill("Kosmiczny kot Ali");
  await page.locator("#project-name").press("Tab");
  await page.locator("#save-menu-toggle").click();
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
  await openExampleProject(tab);
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

async function imageOf(page) {
  return page.locator("#drawing").evaluate((canvas) => canvas.toDataURL());
}
async function setRange(page, selector, value) {
  await page.locator(selector).evaluate((input, value) => {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, String(value));
}
async function holdSand(page, point, duration = 300) {
  const canvas = page.locator("#drawing");
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  await page.mouse.move(
    box.x + (point.x * box.width) / 960,
    box.y + (point.y * box.height) / 640,
  );
  await page.mouse.down();
  await page.waitForTimeout(duration);
  await page.mouse.up();
}
async function countColor(page, { x, y, width, height }, color) {
  return page.locator("#drawing").evaluate(
    (canvas, { x, y, width, height, color }) => {
      const data = canvas
        .getContext("2d")
        .getImageData(x, y, width, height).data;
      let count = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (color.every((value, channel) => data[i + channel] === value))
          count++;
      }
      return count;
    },
    { x, y, width, height, color },
  );
}

test("każde zwierzątko daje się cofnąć, obrócić i zachować w projekcie", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Dodaj warstwę", exact: true })
    .click();
  const blank = await imageOf(page);
  for (const name of ["Oczy", "Ogon", "Uszy", "Łapy"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await setRange(page, "#stamp-rotation", 45);
    await page.locator("#drawing").click({ position: { x: 140, y: 120 } });
    expect(await imageOf(page)).not.toBe(blank);
    await page.getByRole("button", { name: "Cofnij", exact: true }).click();
    await expect.poll(() => imageOf(page)).toBe(blank);
  }
  await page.getByRole("button", { name: "Ponów", exact: true }).click();
  await expect.poll(() => imageOf(page)).not.toBe(blank);
  const paws = await imageOf(page);
  await page
    .getByRole("button", { name: "Ukryj: Warstwa 2", exact: true })
    .click();
  expect(await imageOf(page)).toBe(blank);
  await page
    .getByRole("button", { name: "Pokaż: Warstwa 2", exact: true })
    .click();
  const file = await getDownload(page, "#save-project");
  await page.getByRole("button", { name: "Nowy", exact: true }).click();
  await page.locator("#file-input").setInputFiles(await file.path());
  await expect.poll(() => imageOf(page)).toBe(paws);
});

test("tęcza zmienia kolory w jednej kresce, zwykły kolor je przywraca", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Tęczowy", exact: true }).click();
  await stroke(page, { x: 100, y: 200 }, { x: 700, y: 200 });
  const samples = await Promise.all(
    [150, 300, 450, 600].map((x) => pixels(page, x, 200)),
  );
  expect(new Set(samples.map((color) => color.join())).size).toBe(4);
  expect(
    samples.every(
      (color) =>
        color[3] === 255 && color.slice(0, 3).some((channel) => channel < 200),
    ),
  ).toBe(true);
  const rainbow = await imageOf(page);
  await page.getByRole("button", { name: "Cofnij", exact: true }).click();
  await expect.poll(() => pixels(page, 300, 200)).toEqual([255, 255, 255, 255]);
  await page.getByRole("button", { name: "Ponów", exact: true }).click();
  await expect.poll(() => imageOf(page)).toBe(rainbow);
  await page.getByRole("button", { name: "Czerwony", exact: true }).click();
  await stroke(page, { x: 100, y: 300 }, { x: 700, y: 300 });
  expect(await pixels(page, 300, 300)).toEqual([239, 99, 99, 255]);
  expect(await pixels(page, 600, 300)).toEqual([239, 99, 99, 255]);
});

test("piasek opada na kreskę tej samej warstwy, a na innej spada do dna", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Linia", exact: true }).click();
  await stroke(page, { x: 50, y: 400 }, { x: 910, y: 400 });
  const shelf = await imageOf(page);
  await page.getByRole("button", { name: "Żółty", exact: true }).click();
  await page.getByRole("button", { name: "Piasek", exact: true }).click();
  await holdSand(page, { x: 480, y: 120 });
  const yellow = [244, 206, 84, 255];
  const shelfRegion = { x: 400, y: 350, width: 160, height: 48 };
  await expect
    .poll(() => countColor(page, shelfRegion, yellow))
    .toBeGreaterThan(30);
  // Zapis kończy opadanie i obejmuje wszystkie ziarenka.
  const file = await getDownload(page, "#save-project");
  const settled = await imageOf(page);
  expect(
    await countColor(page, { x: 400, y: 100, width: 160, height: 230 }, yellow),
  ).toBe(0);
  expect(
    await countColor(page, { x: 0, y: 410, width: 960, height: 230 }, yellow),
  ).toBe(0);
  await page.getByRole("button", { name: "Cofnij", exact: true }).click();
  await expect.poll(() => imageOf(page)).toBe(shelf);
  await page.getByRole("button", { name: "Ponów", exact: true }).click();
  await expect.poll(() => imageOf(page)).toBe(settled);
  await page.getByRole("button", { name: "Nowy", exact: true }).click();
  await page.locator("#file-input").setInputFiles(await file.path());
  await expect.poll(() => imageOf(page)).toBe(settled);
  await page
    .getByRole("button", { name: "Dodaj warstwę", exact: true })
    .click();
  await holdSand(page, { x: 480, y: 120 });
  await expect
    .poll(() =>
      countColor(page, { x: 400, y: 600, width: 160, height: 40 }, yellow),
    )
    .toBeGreaterThan(30);
  await page
    .getByRole("button", { name: "Ukryj: Warstwa 2", exact: true })
    .click();
  expect(await imageOf(page)).toBe(settled);
});

test("tryb snu chowa pracownię, blokuje skróty i zachowuje rysunek oraz historię", async ({
  page,
}) => {
  await stroke(page);
  const before = await imageOf(page);
  await page.getByRole("button", { name: "Tryb ciemny", exact: true }).click();
  await expect(page.locator("#app")).toBeHidden();
  await expect(
    page.getByAltText("Kotek śpi w łóżku pod różową kołdrą w gwiazdki."),
  ).toBeVisible();
  await expect(page.locator("#wake")).toBeFocused();
  await page.keyboard.press("Control+z");
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() =>
      document.querySelector("#app").contains(document.activeElement),
    ),
  ).toBe(false);
  await page.locator("#wake").click();
  await expect(page.locator("#app")).toBeVisible();
  expect(await imageOf(page)).toBe(before);
  await page.getByRole("button", { name: "Cofnij", exact: true }).click();
  await expect.poll(() => pixels(page)).toEqual([255, 255, 255, 255]);
});

test("piasek zatrzymuje się także na białych pikselach, a anulowanie dotyku kończy sypanie", async ({
  page,
}) => {
  // Bezpośrednio sprawdzamy fizykę na małej kartce, również tuż przy jej brzegach.
  const result = await page.evaluate(async () => {
    const { createSand } = await import("/src/sand.js");
    const canvas = document.createElement("canvas");
    canvas.width = 60;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 50, 60, 1);
    const sand = createSand(canvas);
    for (let i = 0; i < 20; i++) {
      sand.pour({ x: 30, y: 5 }, 20, "#ff0000");
      sand.step();
    }
    sand.settle();
    const data = ctx.getImageData(0, 0, 60, 80).data;
    let above = 0,
      below = 0,
      floating = 0;
    for (let y = 0; y < 80; y++) {
      for (let x = 0; x < 60; x++) {
        const index = (y * 60 + x) * 4;
        if (data[index] === 255 && data[index + 1] === 0) {
          if (y < 50) above++;
          else below++;
          if (y < 15) floating++;
        }
      }
    }
    return { above, below, floating };
  });
  expect(result.above).toBeGreaterThan(20);
  expect(result.below).toBe(0);
  expect(result.floating).toBe(0);
  await page.getByRole("button", { name: "Piasek", exact: true }).click();
  const canvas = page.locator("#drawing");
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  await canvas.dispatchEvent("pointerdown", {
    pointerId: 1,
    pointerType: "touch",
    button: 0,
    clientX: box.x + 100,
    clientY: box.y + 20,
  });
  await canvas.dispatchEvent("pointercancel", {
    pointerId: 1,
    pointerType: "touch",
  });
  await expect(
    page.getByRole("button", { name: "Cofnij", exact: true }),
  ).toBeEnabled();
  const settled = await imageOf(page);
  await page.waitForTimeout(150);
  expect(await imageOf(page)).toBe(settled);
});

async function dragPreview(page, start, end) {
  const canvas = page.locator("#drawing");
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  const screen = (point) => ({
    x: box.x + (point.x * box.width) / 960,
    y: box.y + (point.y * box.height) / 640,
  });
  const from = screen(start);
  const to = screen(end);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 6 });
}

async function paintedBounds(page) {
  return page.locator("#drawing").evaluate((canvas) => {
    const data = canvas.getContext("2d").getImageData(0, 0, 960, 640).data;
    let left = 960,
      right = -1,
      top = 640,
      bottom = -1;
    for (let y = 0; y < 640; y++) {
      for (let x = 0; x < 960; x++) {
        const i = (y * 960 + x) * 4;
        if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) {
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
      }
    }
    return {
      left,
      right,
      top,
      bottom,
      width: right - left + 1,
      height: bottom - top + 1,
    };
  });
}

test("zwierzątka rosną przy przeciąganiu w obu kierunkach, a podgląd nie zostawia śladów", async ({
  page,
}) => {
  const blank = await imageOf(page);
  for (const tool of ["Oczy", "Uszy", "Ogon", "Łapy"]) {
    await page.getByRole("button", { name: tool, exact: true }).click();
    await dragPreview(page, { x: 150, y: 150 }, { x: 650, y: 550 });
    const large = await paintedBounds(page);
    expect(large.width).toBeGreaterThan(300);
    expect(large.height).toBeGreaterThan(180);
    // Zmniejszenie dodatku usuwa poprzedni podgląd, bez śladów na warstwie.
    const box = await page.locator("#drawing").boundingBox();
    await page.mouse.move(
      box.x + (350 * box.width) / 960,
      box.y + (310 * box.height) / 640,
    );
    const preview = await imageOf(page);
    const small = await paintedBounds(page);
    expect(small.right).toBeLessThanOrEqual(355);
    expect(small.bottom).toBeLessThanOrEqual(315);
    await page.mouse.up();
    expect(await imageOf(page)).toBe(preview);
    await page.getByRole("button", { name: "Cofnij", exact: true }).click();
    await expect.poll(() => imageOf(page)).toBe(blank);
    await expect(page.locator("#undo")).toBeDisabled();
    await stroke(page, { x: 350, y: 310 }, { x: 150, y: 150 });
    expect(await imageOf(page)).toBe(preview);
    await page.locator("#undo").click();
    await expect.poll(() => imageOf(page)).toBe(blank);
  }
});

test("wszystkie odmiany zwierzątek mają różne kształty i zapamiętany wybór", async ({
  page,
}) => {
  const blank = await imageOf(page);
  for (const tool of ["Oczy", "Uszy", "Ogon", "Łapy"]) {
    await page.getByRole("button", { name: tool, exact: true }).click();
    const choices = page.locator("#stamp-variants button");
    await expect(choices).toHaveCount(4);
    const images = new Set();
    for (let index = 0; index < 4; index++) {
      await choices.nth(index).click();
      await expect(choices.nth(index)).toHaveAttribute("aria-pressed", "true");
      await stroke(page, { x: 250, y: 150 }, { x: 650, y: 500 });
      const image = await imageOf(page);
      expect(image).not.toBe(blank);
      images.add(image);
      await page.locator("#undo").click();
      await expect.poll(() => imageOf(page)).toBe(blank);
    }
    expect(images.size).toBe(4);
    await page.getByRole("button", { name: "Pędzel", exact: true }).click();
    await page.getByRole("button", { name: tool, exact: true }).click();
    await expect(choices.nth(3)).toHaveAttribute("aria-pressed", "true");
  }
});

test("anulowanie gestu usuwa podgląd dodatku i chroni wcześniejszy rysunek", async ({
  page,
}) => {
  await stroke(page);
  const before = await imageOf(page);
  await page.getByRole("button", { name: "Uszy", exact: true }).click();
  await dragPreview(page, { x: 400, y: 100 }, { x: 700, y: 400 });
  expect(await imageOf(page)).not.toBe(before);
  await page
    .locator("#drawing")
    .dispatchEvent("pointercancel", { pointerId: 1, pointerType: "mouse" });
  await page.mouse.up();
  expect(await imageOf(page)).toBe(before);
  await page.locator("#undo").click();
  await expect(page.locator("#undo")).toBeDisabled();
});

test("zwierzęce wzory malują wieloma barwami, cofają się i zachowują w projekcie oraz eksporcie", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Przezroczyste", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Dodaj warstwę", exact: true })
    .click();
  const blank = await imageOf(page);
  await setRange(page, "#brush-size", 70);
  const looks = new Set();
  for (const name of [
    "Tygrysie paski",
    "Kocie cętki",
    "Żyrafa",
    "Zebra",
    "Futerko",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await stroke(page, { x: 150, y: 200 }, { x: 750, y: 200 });
    const colors = await page.locator("#drawing").evaluate((canvas) => {
      const data = canvas.getContext("2d").getImageData(200, 180, 64, 40).data;
      const colors = new Set();
      for (let i = 0; i < data.length; i += 4)
        colors.add([...data.slice(i, i + 4)].join());
      return colors.size;
    });
    expect(colors).toBeGreaterThan(1);
    looks.add(await imageOf(page));
    await page.locator("#undo").click();
    await expect.poll(() => imageOf(page)).toBe(blank);
  }
  expect(looks.size).toBe(5);
  await page.locator("#redo").click();
  await expect.poll(() => imageOf(page)).not.toBe(blank);
  await page.getByRole("button", { name: "Uszy", exact: true }).click();
  await page.getByRole("button", { name: "Misiowe", exact: true }).click();
  await page
    .getByRole("button", { name: "Tygrysie paski", exact: true })
    .click();
  await dragPreview(page, { x: 250, y: 280 }, { x: 650, y: 600 });
  const preview = await imageOf(page);
  await page.mouse.up();
  expect(await imageOf(page)).toBe(preview);
  await page
    .getByRole("button", { name: "Ukryj: Warstwa 2", exact: true })
    .click();
  expect(await imageOf(page)).toBe(blank);
  await page
    .getByRole("button", { name: "Pokaż: Warstwa 2", exact: true })
    .click();
  const final = await imageOf(page);
  for (const format of ["png", "webp"]) {
    const file = await getDownload(page, `[data-export="${format}"]`);
    const bytes = await readFile(await file.path());
    const exported = await page.evaluate(
      async ({ base64, format }) => {
        const image = new Image();
        image.src = `data:image/${format};base64,${base64}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = 960;
        canvas.height = 640;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        return {
          image: canvas.toDataURL(),
          alpha: ctx.getImageData(0, 0, 1, 1).data[3],
          mark: ctx.getImageData(300, 200, 1, 1).data[3],
        };
      },
      { base64: bytes.toString("base64"), format },
    );
    expect(exported.alpha).toBe(0);
    expect(exported.mark).toBe(255);
    if (format === "png") expect(exported.image).toBe(final);
  }
  const file = await getDownload(page, "#save-project");
  await page.getByRole("button", { name: "Nowy", exact: true }).click();
  await page.locator("#file-input").setInputFiles(await file.path());
  await expect.poll(() => imageOf(page)).toBe(final);
  await expect(page.locator(".layer-row")).toHaveCount(2);
  await page.getByRole("button", { name: "Czerwony", exact: true }).click();
  await page.getByRole("button", { name: "Pędzel", exact: true }).click();
  await stroke(page, { x: 100, y: 100 }, { x: 700, y: 100 });
  expect(await pixels(page, 300, 100)).toEqual([239, 99, 99, 255]);
});

test("dotyk rozciąga dodatek na telefonie, a przybornik mieści odmiany i wzory", async ({
  browser,
}) => {
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await mobile.newPage();
  await page.goto("/");
  await openExampleProject(page);
  await page.getByRole("button", { name: "Uszy", exact: true }).click();
  await page.getByRole("button", { name: "Królicze", exact: true }).click();
  const blank = await imageOf(page);
  const canvas = page.locator("#drawing");
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  const client = await page.context().newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + box.width * 0.2, y: box.y + box.height * 0.2 }],
  });
  await client.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: box.x + box.width * 0.7, y: box.y + box.height * 0.8 }],
  });
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  expect(await imageOf(page)).not.toBe(blank);
  expect((await paintedBounds(page)).width).toBeGreaterThan(300);
  await page.locator("#undo").click();
  await expect.poll(() => imageOf(page)).toBe(blank);
  await mobile.close();
});

test("przybornik mieści do czterech kolumn i nie rozpycha ekranu z otwartymi odmianami", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Oczy", exact: true }).click();
  for (const width of [
    320, 390, 620, 768, 900, 1024, 1100, 1280, 1440, 1600, 1920, 2560,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const columns = await page
      .locator(".tool-grid")
      .first()
      .evaluate(
        (grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBeGreaterThanOrEqual(2);
    expect(columns).toBeLessThanOrEqual(4);
    if (width === 2560) expect(columns).toBe(4);
    if (width === 1920) expect(columns).toBe(3);
  }
});

test("tęczowe dodatki mają wiele kolorów także po obrocie i kliknięciu", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Uszy", exact: true }).click();
  await page.getByRole("button", { name: "Misiowe", exact: true }).click();
  await page.getByRole("button", { name: "Tęczowy", exact: true }).click();
  const blank = await imageOf(page);
  for (const rotation of [0, 45]) {
    await setRange(page, "#stamp-rotation", rotation);
    await stroke(page, { x: 200, y: 200 }, { x: 600, y: 500 });
    const hues = await page.locator("#drawing").evaluate((canvas) => {
      const data = canvas
        .getContext("2d")
        .getImageData(180, 100, 500, 500).data;
      let green = 0,
        blue = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 1] > data[i] + 60 && data[i + 1] > data[i + 2] + 60)
          green++;
        if (data[i + 2] > data[i] + 60 && data[i + 2] > data[i + 1] + 60)
          blue++;
      }
      return { green, blue };
    });
    expect(hues.green).toBeGreaterThan(100);
    expect(hues.blue).toBeGreaterThan(100);
    await page.locator("#undo").click();
    await expect.poll(() => imageOf(page)).toBe(blank);
  }
  await setRange(page, "#stamp-rotation", 0);
  const canvas = page.locator("#drawing");
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  expect(await pixels(page, 440, 320)).not.toEqual(
    await pixels(page, 470, 320),
  );
});

async function clickPoint(page, x, y, pointerType = "mouse") {
  const canvas = page.locator("#drawing");
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  const event = {
    pointerId: 5,
    pointerType,
    button: 0,
    clientX: box.x + (x * box.width) / 960,
    clientY: box.y + (y * box.height) / 640,
  };
  await canvas.dispatchEvent("pointerdown", event);
  await canvas.dispatchEvent("pointerup", event);
}

test("wiaderko wypełnia wnętrze obrysu, cofa się i nie zmienia innych warstw", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Prostokąt", exact: true }).click();
  await stroke(page, { x: 100, y: 100 }, { x: 500, y: 400 });
  const outline = await imageOf(page);
  await page.getByRole("button", { name: "Wypełnij", exact: true }).click();
  await page.getByRole("button", { name: "Czerwony", exact: true }).click();
  await clickPoint(page, 300, 200);
  expect(await pixels(page, 300, 200)).toEqual([239, 99, 99, 255]);
  expect(await pixels(page, 50, 200)).toEqual([255, 255, 255, 255]);
  expect(await pixels(page, 100, 200)).toEqual([118, 85, 206, 255]);
  const filled = await imageOf(page);
  await page.locator("#undo").click();
  await expect.poll(() => imageOf(page)).toBe(outline);
  await page.locator("#redo").click();
  await expect.poll(() => imageOf(page)).toBe(filled);
  await page.locator("#add-layer").click();
  await page.getByRole("button", { name: "Niebieski", exact: true }).click();
  await clickPoint(page, 300, 200, "pen");
  expect(await pixels(page, 50, 200)).toEqual([105, 169, 232, 255]);
  await page
    .getByRole("button", { name: "Ukryj: Warstwa 2", exact: true })
    .click();
  expect(await imageOf(page)).toBe(filled);
  await clickPoint(page, 300, 200);
  expect(await imageOf(page)).toBe(filled);
});

test("wiaderko obsługuje przezroczystość, wzory, tęczę i dotyk bez zbędnych kroków historii", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Przezroczyste", exact: true })
    .click();
  const blank = await imageOf(page);
  await page.getByRole("button", { name: "Wypełnij", exact: true }).click();
  await clickPoint(page, 0, 0, "touch");
  expect(await pixels(page, 959, 639)).toEqual([118, 85, 206, 255]);
  await clickPoint(page, 100, 100);
  await page.locator("#undo").click();
  await expect.poll(() => imageOf(page)).toBe(blank);
  for (const color of ["Zebra", "Tęczowy"]) {
    await page.getByRole("button", { name: color, exact: true }).click();
    await clickPoint(page, 200, 200);
    const count = await page.locator("#drawing").evaluate((canvas) => {
      const data = canvas.getContext("2d").getImageData(0, 0, 100, 100).data;
      const colors = new Set();
      for (let i = 0; i < data.length; i += 4)
        colors.add([...data.slice(i, i + 4)].join());
      return colors.size;
    });
    expect(count).toBeGreaterThan(1);
    await page.locator("#undo").click();
    await expect.poll(() => imageOf(page)).toBe(blank);
  }
});

for (const [name, id] of [
  ["Sawanna", "savanna"],
  ["Las", "forest"],
  ["Łąka", "meadow"],
  ["Ocean", "ocean"],
  ["Rafa koralowa", "reef"],
  ["Miasto", "city"],
  ["Dżungla", "jungle"],
  ["Arktyczny krajobraz", "arctic"],
]) {
  test(`krajobraz ${name}: cofanie, warstwy, JSON, PNG i WebP`, async ({
    page,
  }) => {
    const before = await imageOf(page);
    const choice = page.getByRole("button", { name, exact: true });
    await choice.click();
    await expect(choice).toHaveAttribute("aria-pressed", "true");
    const landscape = await imageOf(page);
    expect(landscape).not.toBe(before);
    const sky = await pixels(page, 0, 0);
    expect(await pixels(page, 100, 600)).not.toEqual(sky);
    await page.locator("#undo").click();
    await expect.poll(() => imageOf(page)).toBe(before);
    await page.locator("#redo").click();
    await expect.poll(() => imageOf(page)).toBe(landscape);
    await page.getByRole("button", { name: "Prostokąt", exact: true }).click();
    await stroke(page, { x: 200, y: 200 }, { x: 500, y: 400 });
    await page.getByRole("button", { name: "Wypełnij", exact: true }).click();
    await clickPoint(page, 300, 300);
    const final = await imageOf(page);
    const file = await getDownload(page, "#save-project");
    const data = JSON.parse(await readFile(await file.path(), "utf8"));
    expect(data.background).toBe(id);
    await page.locator("#new").click();
    await page.locator("#file-input").setInputFiles(await file.path());
    await expect.poll(() => imageOf(page)).toBe(final);
    for (const format of ["png", "webp"]) {
      const exported = await getDownload(page, `[data-export="${format}"]`);
      const bytes = await readFile(await exported.path());
      const result = await page.evaluate(
        async ({ base64, format }) => {
          const image = new Image();
          image.src = `data:image/${format};base64,${base64}`;
          await image.decode();
          const canvas = document.createElement("canvas");
          canvas.width = 960;
          canvas.height = 640;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0);
          return {
            image: canvas.toDataURL(),
            sky: [...ctx.getImageData(0, 0, 1, 1).data],
          };
        },
        { base64: bytes.toString("base64"), format },
      );
      if (format === "png") expect(result.image).toBe(final);
      expect(result.sky[3]).toBe(255);
      for (let channel = 0; channel < 3; channel++) {
        expect(
          Math.abs(result.sky[channel] - sky[channel]),
        ).toBeLessThanOrEqual(5);
      }
    }
  });
}

test("panele przewijają się niezależnie, a strona zachowuje szerokość okna", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Oczy", exact: true }).click();
  await expect(page.locator("#stamp-size")).toHaveCount(0);
  for (let i = 0; i < 5; i++) await page.locator("#add-layer").click();
  for (const [width, height] of [
    [1024, 600],
    [1280, 720],
    [1440, 900],
    [1600, 600],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    const layout = await page.evaluate(() => {
      const canvas = document.querySelector("#drawing").getBoundingClientRect();
      return {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        ratio: canvas.width / canvas.height,
        panels: [".tools-panel", ".details-panel"].map((selector) => {
          const el = document.querySelector(selector);
          const box = el.getBoundingClientRect();
          return {
            width: box.width,
            top: box.top,
            bottom: box.bottom,
            scrolls: el.scrollHeight > el.clientHeight,
          };
        }),
      };
    });
    expect(layout.width).toBe(width);
    expect(layout.height).toBe(height);
    expect(layout.ratio).toBeCloseTo(1.5, 2);
    expect(layout.panels[0].width).toBeGreaterThanOrEqual(192);
    expect(layout.panels[1].width).toBeGreaterThanOrEqual(208);
    for (const panel of layout.panels) {
      expect(panel.top).toBeGreaterThan(0);
      expect(panel.bottom).toBeLessThan(height);
      if (height <= 900) expect(panel.scrolls).toBe(true);
    }
    await page
      .getByRole("button", { name: "Arktyczny krajobraz", exact: true })
      .click();
    await page.locator("#add-layer").click();
  }
});
