import {
  createIcons,
  Paintbrush,
  PaintBucket,
  Pencil,
  SprayCan,
  Eraser,
  Type,
  Circle,
  Square,
  Minus,
  Undo2,
  Redo2,
  Download,
  FolderOpen,
  Plus,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Palette,
  X,
  Check,
  ImageDown,
  FileJson,
  MousePointer2,
  PawPrint,
  Ear,
  Squirrel,
  Hourglass,
  Moon,
  Sun,
} from "./vendor/lucide.js";
import {
  BACKGROUNDS,
  FONTS,
  MAX_LAYERS,
  MAX_FILE_BYTES,
  makeLayer,
  newProject,
  serialize,
  deserialize,
  paintBackground,
  flatten,
  download,
  filename,
} from "./project.js";
import { fillArea } from "./fill.js";
import { backgroundPreview } from "./backgrounds.js";
import { canvasPoint, drawStroke, drawShape } from "./drawing.js";

import {
  STAMPS,
  STAMP_VARIANTS,
  drawStamp,
  drawStampGesture,
} from "./stamps.js";
import { PATTERNS, patternInfo, patternTile } from "./patterns.js";
import { createSand } from "./sand.js";
import { nextColor, shapeColor } from "./colors.js";

const iconSet = {
  Paintbrush,
  PaintBucket,
  Pencil,
  SprayCan,
  Eraser,
  Type,
  Circle,
  Square,
  Minus,
  Undo2,
  Redo2,
  Download,
  FolderOpen,
  Plus,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Palette,
  X,
  Check,
  ImageDown,
  FileJson,
  MousePointer2,
  PawPrint,
  Ear,
  Squirrel,
  Hourglass,
  Moon,
  Sun,
};
const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const refreshIcons = () =>
  createIcons({ icons: iconSet, attrs: { "stroke-width": 1.8 } });
const colors = [
  ["#7655ce", "Fioletowy"],
  ["#f176a0", "Różowy"],
  ["#ef6363", "Czerwony"],
  ["#ffab54", "Pomarańczowy"],
  ["#f4ce54", "Żółty"],
  ["#77ba82", "Zielony"],
  ["#51bcb4", "Turkusowy"],
  ["#69a9e8", "Niebieski"],
  ["#404b70", "Granatowy"],
  ["#a57c68", "Brązowy"],
  ["#282735", "Czarny"],
  ["#ffffff", "Biały"],
];
const toolsList = [
  ["brush", "Pędzel", "paintbrush"],
  ["pencil", "Ołówek", "pencil"],
  ["spray", "Spray", "spray-can"],
  ["fill", "Wypełnij", "paint-bucket"],
  ["eraser", "Gumka", "eraser"],
  ["line", "Linia", "minus"],
  ["circle", "Koło", "circle"],
  ["rectangle", "Prostokąt", "square"],
  ["text", "Tekst", "type"],
  ["sand", "Piasek", "hourglass"],
];
let project = newProject();
let settings = {
  tool: "brush",
  color: colors[0][0],
  size: 12,
  stampSize: 100,
  rotation: 0,
  hue: 0,
};
let past = [];
let future = [];
let savedSnapshot = JSON.stringify(serialize(project));
let dirty = false;
let busy = false;
let gesture = null;
let toastTimer;
let sandFrame;
let sleeping = false;
const stampTools = STAMPS.map(([id]) => id);
const shapes = ["line", "circle", "rectangle"];
const previewTools = [...shapes, ...stampTools];
const chosenVariants = Object.fromEntries(
  Object.entries(STAMP_VARIANTS).map(([tool, variants]) => [
    tool,
    variants[0][0],
  ]),
);

const app = document.querySelector("#app");
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="./" aria-label="Ala Paint — strona główna"><span class="brand-mark">${icon("paintbrush")}</span><span>Ala<span class="brand-accent">Paint</span><small>mała pracownia,<br>wielka wyobraźnia</small></span></a>
    <button id="sleep" class="button subtle">${icon("moon")}<span>Tryb ciemny</span></button>
    <div class="file-actions">
      <button id="new" class="button subtle">${icon("plus")}<span>Nowy</span></button>
      <button id="open" class="button subtle">${icon("folder-open")}<span>Otwórz</span></button>
      <div class="save-wrap"><button id="save-menu-toggle" class="button primary" aria-expanded="false" aria-controls="save-menu">${icon("download")}<span>Zapisz rysunek</span>${icon("chevron-down")}</button>
        <div id="save-menu" class="save-menu" hidden>
          <button id="save-project">${icon("file-json")}<span>Zapisz projekt<small>JSON · wróć do rysowania później</small></span></button>
          <button data-export="png">${icon("image-down")}<span>Pobierz PNG<small>Obrazek w pełnej jakości</small></span></button>
          <button data-export="webp">${icon("image-down")}<span>Pobierz WebP<small>Lekki obrazek do dzielenia się</small></span></button>
        </div>
      </div>
    </div>
  </header>
  <main class="workspace">
    <aside class="tools-panel panel" aria-label="Narzędzia do rysowania">
      <div class="section-heading"><h2>Przybornik</h2>${icon("sparkles")}</div>
      <div class="tool-grid">${toolsList.map(([id, label, symbol]) => `<button class="tool ${id === "brush" ? "selected" : ""}" data-tool="${id}" aria-pressed="${id === "brush"}">${icon(symbol)}<span>${label}</span></button>`).join("")}</div>
      <section class="control-section"><div class="section-heading"><h2>Zwierzątka Ali</h2>${icon("paw-print")}</div>
        <div class="tool-grid stamp-grid">${STAMPS.map(([id, label, symbol]) => `<button class="tool" data-tool="${id}" aria-pressed="false">${icon(symbol)}<span>${label}</span></button>`).join("")}</div>
        <div id="stamp-controls" hidden>
          <div id="stamp-variants" class="variant-grid" role="group" aria-label="Odmiany zwierzątek"></div>
          <label for="stamp-rotation">Obrót <output id="stamp-rotation-value">0°</output></label><input id="stamp-rotation" type="range" min="-180" max="180" step="15" value="0">
          <p class="hint">Naciśnij i przeciągnij, aby wybrać wielkość dodatku. Możesz też kliknąć, aby przybić stempelek.</p>
        </div>
      </section>
      <section class="control-section"><div class="section-heading"><h2>Kolory</h2>${icon("palette")}</div>
        <div class="color-grid">${colors.map(([color, label], index) => `<button class="swatch ${index === 0 ? "selected" : ""}" style="--swatch:${color}" data-color="${color}" aria-label="${label}" aria-pressed="${index === 0}" title="${label}"></button>`).join("")}</div>
        <button class="rainbow-button" data-color="rainbow" aria-pressed="false"><span class="rainbow-dot" aria-hidden="true"></span>Tęczowy</button>
        <h3 class="patterns-heading">Zwierzęce wzory</h3>
        <div class="pattern-grid">${PATTERNS.map(([id, label]) => `<button class="pattern-button" data-color="${id}" aria-pressed="false"><canvas width="64" height="40" data-pattern-preview="${id}" aria-hidden="true"></canvas><span>${label}</span></button>`).join("")}</div>
        <label class="custom-color"><input id="custom-color" type="color" value="#7655ce" aria-label="Własny kolor"><span>Twój własny kolor</span><span class="plus-label">+</span></label>
      </section>
      <section class="control-section size-control"><div class="section-heading"><label for="brush-size">Wielkość</label><output id="size-value" for="brush-size">12</output></div>
        <input id="brush-size" type="range" min="1" max="70" value="12">
        <div class="size-preview"><span class="small-dot"></span><span id="brush-preview"></span><span class="large-dot"></span></div>
      </section>
      <section id="text-controls" class="control-section" hidden><h2>Twój napis</h2><label for="text-value">Co napiszemy?</label><input id="text-value" type="text" maxlength="200" placeholder="Cześć, świecie!" value="Cześć, świecie!">
        <label for="font-family">Czcionka</label><select id="font-family">${FONTS.map((font, index) => `<option value="${index}">${font.name}</option>`).join("")}</select>
        <label for="font-size">Wielkość liter</label><input id="font-size" type="number" min="12" max="180" value="48"><p class="hint">Kliknij na kartce, aby dodać napis.</p>
      </section>
      <div class="tool-tip"><span>✦</span><p>Każda wielka przygoda<br>zaczyna się od kreski.</p></div>
    </aside>
    <section class="drawing-area" aria-label="Twoja pracownia">
      <div class="drawing-toolbar"><div class="drawing-title"><label class="sr-only" for="project-name">Nazwa rysunku</label><input id="project-name" maxlength="80" value="Mój pierwszy rysunek"><span id="save-status"><span class="status-dot"></span> Gotowy na twoje pomysły</span></div>
        <div class="history-actions"><button id="undo" class="icon-button" title="Cofnij (Ctrl / ⌘ + Z)" aria-label="Cofnij" disabled>${icon("undo-2")}</button><button id="redo" class="icon-button" title="Ponów (Ctrl / ⌘ + Shift + Z)" aria-label="Ponów" disabled>${icon("redo-2")}</button></div>
      </div>
      <div class="canvas-surround"><div class="paper-label">TWOJA WYOBRAŹNIA MA TU MIEJSCE <span>✧</span></div><div class="paper"><canvas id="drawing" width="960" height="640" aria-label="Kartka do rysowania. Rysuj myszą, palcem lub rysikiem."></canvas></div><div class="canvas-bottom"><span id="dimensions">960 × 640 px</span><span>${icon("mouse-pointer-2")}<span id="canvas-hint">Wybierz kolor i narysuj coś swojego</span></span><span id="zoom">100%</span></div></div>
      <div class="encouragement"><span class="encouragement-icon">✳</span><p>Tu nie ma złych kresek.<br><strong>Są tylko nowe pomysły!</strong></p><span class="doodle">✧</span></div>
    </section>
    <aside class="details-panel" aria-label="Warstwy i tło">
      <section class="panel layers-panel"><div class="section-heading"><h2>${icon("layers")} Warstwy</h2><span id="layer-count" class="count">1 / 12</span></div><p class="section-description">Jak przezroczyste kartki,<br>jedna na drugiej.</p><button id="add-layer" class="button add-layer">${icon("plus")} Dodaj warstwę</button><div id="layer-list" class="layer-list"></div>
        <div class="layer-actions"><button id="layer-up" class="icon-button" aria-label="Przesuń warstwę wyżej" title="Przesuń wyżej">${icon("arrow-up")}<span>Wyżej</span></button><button id="layer-down" class="icon-button" aria-label="Przesuń warstwę niżej" title="Przesuń niżej">${icon("arrow-down")}<span>Niżej</span></button><span></span><button id="delete-layer" class="icon-button danger" aria-label="Usuń warstwę" title="Usuń warstwę">${icon("trash-2")}<span>Usuń</span></button></div><p class="hint layer-hint">Rysujesz na zaznaczonej warstwie.</p>
      </section>
      <section class="panel background-panel"><div class="section-heading"><h2>Tło kartki</h2>${icon("image-down")}</div><p class="section-description">Od czego dziś zaczniemy?</p><div class="background-grid">${BACKGROUNDS.map((bg) => `<button data-background="${bg.id}" class="background-choice" aria-pressed="${bg.id === "white"}"><span class="background-sample ${bg.id === "transparent" ? "checkerboard" : ""}" style="--background:${bg.color || "transparent"}">${bg.id === "white" ? icon("check") : ""}</span><span>${bg.name}</span></button>`).join("")}</div></section>
      <div class="future-card"><span class="eyebrow">JESZCZE WIĘCEJ WYOBRAŹNI</span><div class="little-eyes"><span></span><span></span><b>✧</b></div><h3>Postacie z charakterem</h3><p>Oczy, minki i inne cuda…<br>Wybierz oczy, uszy, łapy lub ogon<br>i stwórz własnego przyjaciela!</p><span class="soon">Już w przyborniku!</span></div>
    </aside>
  </main>
  <footer><div class="footer-credits"><a href="https://github.com/alicjachaba/ala-paint" target="_blank" rel="noopener noreferrer">AlaPaint na GitHubie</a><span class="footer-notes">Rysunki zostają u ciebie · bez konta, bez pośpiechu</span><span>stworzone przez Alę z małą pomocą Taty</span></div></footer>
  <input id="file-input" type="file" accept=".json,application/json" hidden>
  <div id="toast" role="status" aria-live="polite" hidden></div>
  <dialog id="confirm-dialog"><form method="dialog"><div class="dialog-icon">${icon("sparkles")}</div><h2 id="confirm-title"></h2><p id="confirm-message"></p><div class="dialog-actions"><button value="cancel" class="button subtle" autofocus>Wróć do rysowania</button><button value="confirm" class="button primary" id="confirm-button">Tak, zaczynamy</button></div></form></dialog>
`;
const sleepScreen = document.createElement("section");
sleepScreen.id = "sleep-screen";
sleepScreen.hidden = true;
sleepScreen.setAttribute("aria-labelledby", "sleep-title");
const sleepingCatUrl = new URL("../assets/sleeping-cat.svg", import.meta.url)
  .href;
sleepScreen.innerHTML = `<div class="sleep-card"><p class="sleep-eyebrow">PRACOWNIA ALI · CISZA NOCNA</p><h1 id="sleep-title">Ciii… wyobraźnia śpi.</h1><p class="sleep-zzz">zz.. zzz... zzzz...</p><img src="${sleepingCatUrl}" alt="Kotek śpi w łóżku pod różową kołdrą w gwiazdki." width="600" height="380"><p>Jeszcze tylko pięć minut…<br>Twój rysunek czeka, aż wrócisz.</p><button id="wake" class="button primary">${icon("sun")} Tryb jasny — wracamy do rysowania</button></div>`;
document.body.append(sleepScreen);

const $ = (selector) => document.querySelector(selector);
const canvas = $("#drawing");
const context = canvas.getContext("2d");
const previewCanvas = document.createElement("canvas");
const previewContext = previewCanvas.getContext("2d");
const activeLayer = () =>
  project.layers.find((layer) => layer.id === project.activeLayerId);
const snapshot = () => JSON.stringify(serialize(project));

function toast(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  toastTimer = setTimeout(() => {
    $("#toast").hidden = true;
  }, 4500);
}

function confirmAction(title, message, button = "Tak, zaczynamy") {
  $("#confirm-title").textContent = title;
  $("#confirm-message").textContent = message;
  $("#confirm-button").textContent = button;
  const dialog = $("#confirm-dialog");
  dialog.returnValue = "cancel";
  dialog.showModal();
  return new Promise((resolve) =>
    dialog.addEventListener(
      "close",
      () => resolve(dialog.returnValue === "confirm"),
      { once: true },
    ),
  );
}

function drawPreview(target) {
  const draw = stampTools.includes(gesture.settings.tool)
    ? drawStampGesture
    : drawShape;
  draw(target, gesture.start, gesture.last, gesture.settings);
}

function renderCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  paintBackground(context, project);
  project.layers.forEach((layer) => {
    if (!layer.visible) return;
    if (
      gesture &&
      previewTools.includes(gesture.settings.tool) &&
      layer.id === gesture.layer.id
    ) {
      // Podgląd powstaje na kopii warstwy, aby wyglądał tak samo po puszczeniu.
      if (previewCanvas.width !== canvas.width)
        previewCanvas.width = canvas.width;
      if (previewCanvas.height !== canvas.height)
        previewCanvas.height = canvas.height;
      previewContext.clearRect(0, 0, canvas.width, canvas.height);
      previewContext.drawImage(layer.canvas, 0, 0);
      drawPreview(previewContext);
      context.drawImage(previewCanvas, 0, 0);
    } else {
      context.drawImage(layer.canvas, 0, 0);
    }
    if (gesture?.sand && layer.id === gesture.layer.id)
      gesture.sand.draw(context);
  });
}

function updateHistory() {
  $("#undo").disabled = !past.length || busy;
  $("#redo").disabled = !future.length || busy;
  $("#save-status").innerHTML =
    `<span class="status-dot ${dirty ? "unsaved" : ""}"></span>${dirty ? "Masz nowe pomysły do zapisania" : "Projekt bez niezapisanych zmian"}`;
}

function commit(before) {
  const after = snapshot();
  if (before === after) return;
  past.push(before);
  // Ograniczamy zarówno liczbę kroków, jak i pamięć zajmowaną przez historię.
  while (
    past.length > 25 ||
    (past.length > 1 &&
      past.reduce((sum, item) => sum + item.length, 0) > 32_000_000)
  )
    past.shift();
  future = [];
  dirty = after !== savedSnapshot;
  updateHistory();
  renderLayers();
}

function mutate(action) {
  if (busy || gesture) return;
  const before = snapshot();
  action();
  commit(before);
  renderAll();
}

function renderLayers() {
  const list = $("#layer-list");
  list.replaceChildren();
  [...project.layers].reverse().forEach((layer) => {
    const row = document.createElement("div");
    row.className = `layer-row ${layer.id === project.activeLayerId ? "active" : ""} ${layer.visible ? "" : "hidden-layer"}`;
    const select = document.createElement("button");
    select.className = "layer-select";
    select.setAttribute(
      "aria-pressed",
      String(layer.id === project.activeLayerId),
    );
    select.setAttribute("aria-label", `Wybierz: ${layer.name}`);
    const thumb = document.createElement("canvas");
    thumb.width = 60;
    thumb.height = 40;
    thumb.className = "layer-thumbnail checkerboard";
    thumb.getContext("2d").drawImage(layer.canvas, 0, 0, 60, 40);
    const label = document.createElement("span");
    label.textContent = layer.name;
    select.append(thumb, label);
    select.onclick = () => {
      if (!busy && !gesture) {
        project.activeLayerId = layer.id;
        renderLayers();
        updateHint();
      }
    };
    const visibility = document.createElement("button");
    visibility.className = "visibility icon-button";
    visibility.setAttribute(
      "aria-label",
      `${layer.visible ? "Ukryj" : "Pokaż"}: ${layer.name}`,
    );
    visibility.innerHTML = icon(layer.visible ? "eye" : "eye-off");
    visibility.onclick = () =>
      mutate(() => {
        layer.visible = !layer.visible;
      });
    row.append(select, visibility);
    list.append(row);
  });
  const index = project.layers.findIndex(
    (layer) => layer.id === project.activeLayerId,
  );
  $("#layer-count").textContent = `${project.layers.length} / ${MAX_LAYERS}`;
  $("#add-layer").disabled =
    project.layers.length >= MAX_LAYERS ||
    project.width * project.height * (project.layers.length + 1) > 20_000_000;
  $("#layer-up").disabled = index === project.layers.length - 1;
  $("#layer-down").disabled = index === 0;
  $("#delete-layer").disabled = project.layers.length === 1;
  refreshIcons();
}

function updateHint() {
  $("#canvas-hint").textContent = !activeLayer().visible
    ? "Ta warstwa jest ukryta. Włącz ją przyciskiem oka."
    : settings.tool === "fill"
      ? "Kliknij zamknięty obszar na wybranej warstwie, aby go wypełnić."
      : settings.tool === "sand"
        ? "Przytrzymaj, aby sypać. Piasek zatrzyma się na kreskach tej warstwy."
        : stampTools.includes(settings.tool)
          ? "Naciśnij i przeciągnij, aby narysować zwierzęcy dodatek"
          : settings.tool === "text"
            ? "Wpisz tekst w przyborniku i kliknij na kartce"
            : shapes.includes(settings.tool)
              ? "Przeciągnij po kartce, aby narysować kształt"
              : "Wybierz kolor i narysuj coś swojego";
}

function renderAll() {
  $(".paper").style.setProperty(
    "--paper-ratio",
    project.width / project.height,
  );
  if (canvas.width !== project.width) canvas.width = project.width;
  if (canvas.height !== project.height) canvas.height = project.height;
  $("#project-name").value = project.name;
  $("#dimensions").textContent = `${project.width} × ${project.height} px`;
  document.querySelectorAll("[data-background]").forEach((button) => {
    const selected = button.dataset.background === project.background;
    button.setAttribute("aria-pressed", selected);
    button.querySelector(".background-sample").innerHTML = selected
      ? icon("check")
      : "";
  });
  renderCanvas();
  renderLayers();
  updateHistory();
  updateHint();
}

function setColor(color) {
  settings.color = color;
  if (color.startsWith("#")) $("#custom-color").value = color;
  document.documentElement.style.setProperty(
    "--drawing-color",
    color === "rainbow" ? "#ec4899" : patternInfo(color)?.[2] || color,
  );
  document.querySelectorAll("[data-color]").forEach((button) => {
    const selected = button.dataset.color === color;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", selected);
  });
  renderStampVariants();
}

function renderStampVariants() {
  const variants = STAMP_VARIANTS[settings.tool];
  if (!variants) return;
  const list = $("#stamp-variants");
  list.replaceChildren();
  for (const [variant, label] of variants) {
    const button = document.createElement("button");
    button.className = "variant-button";
    button.dataset.variant = variant;
    button.setAttribute(
      "aria-pressed",
      variant === chosenVariants[settings.tool],
    );
    const preview = document.createElement("canvas");
    preview.width = 100;
    preview.height = 80;
    preview.setAttribute("aria-hidden", "true");
    drawStamp(
      preview.getContext("2d"),
      { x: 50, y: 40 },
      {
        tool: settings.tool,
        variant,
        stampSize: 72,
        color: settings.color,
      },
    );
    const name = document.createElement("span");
    name.textContent = label;
    button.append(preview, name);
    button.onclick = () => {
      chosenVariants[settings.tool] = variant;
      list
        .querySelectorAll("button")
        .forEach((item) => item.setAttribute("aria-pressed", item === button));
    };
    list.append(button);
  }
}

document.querySelectorAll("[data-pattern-preview]").forEach((preview) => {
  preview
    .getContext("2d")
    .drawImage(patternTile(preview.dataset.patternPreview), 0, 0);
});

document.querySelectorAll("[data-tool]").forEach(
  (button) =>
    (button.onclick = () => {
      settings.tool = button.dataset.tool;
      document.querySelectorAll("[data-tool]").forEach((item) => {
        item.classList.toggle("selected", item === button);
        item.setAttribute("aria-pressed", item === button);
      });
      $("#text-controls").hidden = settings.tool !== "text";
      $("#stamp-controls").hidden = !stampTools.includes(settings.tool);
      $(".size-control").hidden = settings.tool === "fill";
      renderStampVariants();
      canvas.style.cursor = settings.tool === "text" ? "text" : "crosshair";
      updateHint();
    }),
);
document
  .querySelectorAll("[data-color]")
  .forEach((button) => (button.onclick = () => setColor(button.dataset.color)));
$("#stamp-rotation").oninput = (event) => {
  settings.rotation = Number(event.target.value);
  $("#stamp-rotation-value").value = `${settings.rotation}°`;
};
$("#custom-color").oninput = (event) => setColor(event.target.value);
$("#brush-size").oninput = (event) => {
  settings.size = Number(event.target.value);
  $("#size-value").textContent = settings.size;
  $("#brush-preview").style.setProperty(
    "--brush-size",
    `${Math.min(38, settings.size)}px`,
  );
};
for (const background of BACKGROUNDS.filter((bg) => bg.landscape)) {
  const sample = $(`[data-background="${background.id}"] .background-sample`);
  sample.style.backgroundImage = `url(${backgroundPreview(background.id)})`;
  sample.style.backgroundSize = "cover";
}
document.querySelectorAll("[data-background]").forEach(
  (button) =>
    (button.onclick = () =>
      mutate(() => {
        project.background = button.dataset.background;
      })),
);
$("#project-name").onchange = (event) => {
  const name = event.target.value.trim() || "Mój rysunek";
  mutate(() => {
    project.name = name;
  });
};

canvas.addEventListener("pointerdown", (event) => {
  if (gesture?.sand && !gesture.pouring) finishSand();
  if (sleeping || busy || gesture || event.button !== 0) return;
  if (!activeLayer().visible) {
    toast("Najpierw pokaż tę warstwę — kliknij oko obok jej nazwy.");
    return;
  }
  event.preventDefault();
  const point = canvasPoint(event, canvas);
  const layer = activeLayer();
  const before = snapshot();
  if (settings.tool === "fill") {
    fillArea(layer.canvas, point, settings);
    commit(before);
    renderCanvas();
    return;
  }
  if (settings.tool === "text") {
    const text = $("#text-value").value.trim();
    const size = Number($("#font-size").value);
    if (!text) {
      toast("Wpisz najpierw swój napis w przyborniku.");
      $("#text-value").focus();
      return;
    }
    if (!Number.isFinite(size) || size < 12 || size > 180) {
      toast("Wybierz wielkość liter od 12 do 180.");
      return;
    }
    const ctx = layer.canvas.getContext("2d");
    ctx.save();
    ctx.font = `${size}px ${FONTS[Number($("#font-family").value)].family}`;
    ctx.textBaseline = "top";
    ctx.fillStyle = shapeColor(ctx, settings, point, {
      x: point.x + ctx.measureText(text).width,
      y: point.y,
    });
    ctx.fillText(text, point.x, point.y);
    ctx.restore();
    commit(before);
    renderCanvas();
    return;
  }
  gesture = {
    pointerId: event.pointerId,
    start: point,
    last: point,
    before,
    layer,
    settings: { ...settings, variant: chosenVariants[settings.tool] },
  };
  canvas.setPointerCapture(event.pointerId);
  if (settings.tool === "sand") {
    gesture.sand = createSand(layer.canvas);
    gesture.pouring = true;
    gesture.lastFrame = performance.now();
    gesture.sand.pour(point, settings.size, nextColor(gesture.settings));
    sandFrame = requestAnimationFrame(animateSand);
  } else if (!previewTools.includes(settings.tool))
    drawStroke(layer.canvas.getContext("2d"), point, point, gesture.settings);
  renderCanvas();
});
canvas.addEventListener("pointermove", (event) => {
  if (!gesture || event.pointerId !== gesture.pointerId) return;
  const samples = event.getCoalescedEvents?.();
  for (const sample of samples?.length ? samples : [event]) {
    const point = canvasPoint(sample, canvas);
    if (!gesture.sand && !previewTools.includes(gesture.settings.tool))
      drawStroke(
        gesture.layer.canvas.getContext("2d"),
        gesture.last,
        point,
        gesture.settings,
      );
    gesture.last = point;
  }
  renderCanvas();
});
function finishGesture(event) {
  if (!gesture || event.pointerId !== gesture.pointerId) return;
  if (gesture.sand) {
    gesture.pouring = false;
    if (canvas.hasPointerCapture(gesture.pointerId))
      canvas.releasePointerCapture(gesture.pointerId);
    return;
  }
  if (event.type === "pointerup") {
    const point = canvasPoint(event, canvas);
    if (!gesture.sand && !previewTools.includes(gesture.settings.tool))
      drawStroke(
        gesture.layer.canvas.getContext("2d"),
        gesture.last,
        point,
        gesture.settings,
      );
    gesture.last = point;
  }
  if (
    previewTools.includes(gesture.settings.tool) &&
    (event.type === "pointerup" || !stampTools.includes(gesture.settings.tool))
  )
    drawPreview(gesture.layer.canvas.getContext("2d"));
  settings.hue = gesture.settings.hue;
  const before = gesture.before;
  const pointerId = gesture.pointerId;
  gesture = null;
  if (canvas.hasPointerCapture(pointerId))
    canvas.releasePointerCapture(pointerId);
  commit(before);
  renderCanvas();
}
canvas.addEventListener("pointerup", finishGesture);
canvas.addEventListener("pointercancel", finishGesture);
canvas.addEventListener("lostpointercapture", finishGesture);

// Po puszczeniu ziarenka jeszcze spadają. Kolejna czynność najpierw je osadza.
function animateSand(time) {
  if (!gesture?.sand) return;
  // Stałe tempo sypania także na ekranach 120 Hz; bez nadrabiania długich przerw.
  if (time - gesture.lastFrame < 1000 / 60) {
    sandFrame = requestAnimationFrame(animateSand);
    return;
  }
  gesture.lastFrame = time - ((time - gesture.lastFrame) % (1000 / 60));
  if (gesture.pouring)
    gesture.sand.pour(
      gesture.last,
      gesture.settings.size,
      nextColor(gesture.settings),
    );
  const remaining = gesture.sand.step();
  renderCanvas();
  if (!gesture.pouring && !remaining) finishSand();
  else sandFrame = requestAnimationFrame(animateSand);
}
function finishSand() {
  if (!gesture?.sand) return;
  cancelAnimationFrame(sandFrame);
  gesture.sand.settle();
  const { before, pointerId } = gesture;
  settings.hue = gesture.settings.hue;
  gesture = null;
  if (canvas.hasPointerCapture(pointerId))
    canvas.releasePointerCapture(pointerId);
  commit(before);
  renderCanvas();
}
document.addEventListener(
  "pointerdown",
  (event) => {
    if (event.target !== canvas && gesture?.sand) finishSand();
  },
  true,
);
document.addEventListener(
  "click",
  (event) => {
    if (event.target !== canvas && gesture?.sand) finishSand();
  },
  true,
);
window.addEventListener("blur", () => {
  if (gesture?.sand) finishSand();
  else if (gesture) finishGesture({ pointerId: gesture.pointerId });
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && gesture?.sand) finishSand();
});
$("#sleep").onclick = () => {
  if (busy) return;
  finishSand();
  if (gesture) finishGesture({ pointerId: gesture.pointerId });
  closeSaveMenu();
  sleeping = true;
  app.hidden = true;
  app.inert = true;
  sleepScreen.hidden = false;
  document.body.classList.add("sleeping");
  $("#wake").focus();
};
$("#wake").onclick = () => {
  sleeping = false;
  sleepScreen.hidden = true;
  app.hidden = false;
  app.inert = false;
  document.body.classList.remove("sleeping");
  $("#sleep").focus();
};

async function travelHistory(direction) {
  if (busy || gesture) return;
  const from = direction === "undo" ? past : future;
  const to = direction === "undo" ? future : past;
  if (!from.length) return;
  busy = true;
  updateHistory();
  try {
    const restored = await deserialize(JSON.parse(from.at(-1)));
    to.push(snapshot());
    from.pop();
    project = restored;
    dirty = snapshot() !== savedSnapshot;
  } catch {
    toast("Nie udało się przywrócić tego kroku. Twój rysunek jest bezpieczny.");
  } finally {
    busy = false;
    renderAll();
  }
}
$("#undo").onclick = () => travelHistory("undo");
$("#redo").onclick = () => travelHistory("redo");
$("#add-layer").onclick = () =>
  mutate(() => {
    if ($("#add-layer").disabled) return;
    let number = 1;
    while (project.layers.some((layer) => layer.name === `Warstwa ${number}`))
      number++;
    const layer = makeLayer(project.width, project.height, `Warstwa ${number}`);
    project.layers.push(layer);
    project.activeLayerId = layer.id;
  });
function moveLayer(direction) {
  mutate(() => {
    const index = project.layers.findIndex(
      (layer) => layer.id === project.activeLayerId,
    );
    const next = index + direction;
    if (next < 0 || next >= project.layers.length) return;
    [project.layers[index], project.layers[next]] = [
      project.layers[next],
      project.layers[index],
    ];
  });
}
$("#layer-up").onclick = () => moveLayer(1);
$("#layer-down").onclick = () => moveLayer(-1);
$("#delete-layer").onclick = () =>
  mutate(() => {
    if (project.layers.length === 1) return;
    const index = project.layers.findIndex(
      (layer) => layer.id === project.activeLayerId,
    );
    project.layers.splice(index, 1);
    project.activeLayerId = project.layers[Math.max(0, index - 1)].id;
    toast("Warstwa usunięta. Przycisk Cofnij może ją przywrócić.");
  });

function closeSaveMenu() {
  $("#save-menu").hidden = true;
  $("#save-menu-toggle").setAttribute("aria-expanded", "false");
}
$("#save-menu-toggle").onclick = () => {
  $("#save-menu").hidden = !$("#save-menu").hidden;
  $("#save-menu-toggle").setAttribute("aria-expanded", !$("#save-menu").hidden);
};
document.addEventListener("click", (event) => {
  if (!event.target.closest(".save-wrap")) closeSaveMenu();
});
document.addEventListener("keydown", (event) => {
  if (sleeping) return;
  if (
    (event.ctrlKey || event.metaKey) &&
    ["z", "y", "s"].includes(event.key.toLowerCase())
  )
    finishSand();
  if (event.key === "Escape") closeSaveMenu();
  if (event.target.closest("input, textarea, select, dialog")) return;
  if (event.ctrlKey || event.metaKey) {
    if (event.key.toLowerCase() === "z") {
      event.preventDefault();
      travelHistory(event.shiftKey ? "redo" : "undo");
    }
    if (event.key.toLowerCase() === "y") {
      event.preventDefault();
      travelHistory("redo");
    }
    if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveProject();
    }
  }
});
function saveProject() {
  if (busy || gesture) return;
  const data = snapshot();
  download(
    new Blob([data], { type: "application/json" }),
    `${filename(project.name)}.ala.json`,
  );
  savedSnapshot = data;
  dirty = false;
  updateHistory();
  closeSaveMenu();
  toast("Projekt przekazany do pobrania. Wrócisz do niego przyciskiem Otwórz.");
}
$("#save-project").onclick = saveProject;
document.querySelectorAll("[data-export]").forEach(
  (button) =>
    (button.onclick = async () => {
      if (busy || gesture) return;
      const format = button.dataset.export;
      const name = filename(project.name);
      closeSaveMenu();
      const exported = flatten(project);
      try {
        const blob = await new Promise((resolve) =>
          exported.toBlob(resolve, `image/${format}`, 0.95),
        );
        if (!blob || blob.type !== `image/${format}`) throw new Error();
        download(blob, `${name}.${format}`);
        toast(`Obrazek ${format.toUpperCase()} przekazany do pobrania. Brawo!`);
      } catch {
        toast(
          `Ta przeglądarka nie potrafi zapisać ${format.toUpperCase()}. Spróbuj formatu PNG.`,
        );
      }
    }),
);

$("#new").onclick = async () => {
  if (busy || gesture) return;
  busy = true;
  try {
    if (
      dirty &&
      !(await confirmAction(
        "Zaczynamy od nowej kartki?",
        "Masz niezapisany rysunek. Wróć i zapisz projekt, jeśli chcesz zachować go na później.",
      ))
    )
      return;
    project = newProject();
    past = [];
    future = [];
    savedSnapshot = snapshot();
    dirty = false;
    toast("Nowa kartka, nowa przygoda!");
  } finally {
    busy = false;
    renderAll();
  }
};
$("#open").onclick = () => {
  if (!busy && !gesture) $("#file-input").click();
};
$("#file-input").onchange = async (event) => {
  const file = event.target.files[0];
  event.target.value = "";
  if (!file || busy || gesture) return;
  busy = true;
  updateHistory();
  try {
    if (file.size > MAX_FILE_BYTES)
      throw new Error(
        "Ten plik jest za duży. Wybierz projekt mniejszy niż 20 MB.",
      );
    let data;
    try {
      data = JSON.parse(await file.text());
    } catch {
      throw new Error(
        "Nie mogę odczytać tego pliku. Wybierz projekt Ala Paint w formacie JSON.",
      );
    }
    const loaded = await deserialize(data);
    if (
      dirty &&
      !(await confirmAction(
        "Otworzyć inny rysunek?",
        "Obecny rysunek ma niezapisane zmiany. Wróć i zapisz go, jeśli chcesz go zachować.",
        "Otwórz projekt",
      ))
    )
      return;
    project = loaded;
    past = [];
    future = [];
    savedSnapshot = snapshot();
    dirty = false;
    toast("Rysunek otwarty. Tworzymy dalej!");
  } catch (error) {
    toast(
      error.message ||
        "Nie udało się otworzyć pliku. Twój obecny rysunek jest bezpieczny.",
    );
  } finally {
    busy = false;
    renderAll();
  }
};
window.addEventListener("beforeunload", (event) => {
  if (dirty || gesture) {
    event.preventDefault();
    event.returnValue = "";
  }
});
new ResizeObserver(() => {
  $("#zoom").textContent =
    `${Math.round((canvas.getBoundingClientRect().width / canvas.width) * 100)}%`;
}).observe(canvas);
renderAll();
