// Projekt przechowuje osobny, przezroczysty obraz dla każdej warstwy.
export const PROJECT_VERSION = 1;
export const MAX_LAYERS = 12;
export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const BACKGROUNDS = [
  { id: "white", name: "Białe", color: "#ffffff" },
  { id: "cream", name: "Waniliowe", color: "#fff5df" },
  { id: "mint", name: "Miętowe", color: "#e7f6ef" },
  { id: "sky", name: "Niebo", color: "#e4f1ff" },
  { id: "pink", name: "Różowe", color: "#ffedf3" },
  { id: "transparent", name: "Przezroczyste", color: null },
];
export const FONTS = [
  { name: "Przyjazna", family: '"Trebuchet MS", Arial, sans-serif' },
  { name: "Komiksowa", family: '"Comic Sans MS", "Chalkboard SE", cursive' },
  { name: "Klasyczna", family: 'Georgia, "Times New Roman", serif' },
  { name: "Prosta", family: "Arial, Helvetica, sans-serif" },
  { name: "Maszynowa", family: '"Courier New", monospace' },
];

export function makeCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function makeLayer(width, height, name = "Warstwa 1") {
  return {
    id: crypto.randomUUID(),
    name,
    visible: true,
    canvas: makeCanvas(width, height),
  };
}

export function newProject() {
  const width = 960;
  const height = 640;
  const layer = makeLayer(width, height);
  return {
    name: "Mój pierwszy rysunek",
    width,
    height,
    background: "white",
    layers: [layer],
    activeLayerId: layer.id,
  };
}

export function serialize(project) {
  return {
    format: "ala-paint",
    version: PROJECT_VERSION,
    name: project.name,
    width: project.width,
    height: project.height,
    background: project.background,
    activeLayerId: project.activeLayerId,
    layers: project.layers.map(({ id, name, visible, canvas }) => ({
      id,
      name,
      visible,
      image: canvas.toDataURL("image/png"),
    })),
  };
}

export async function deserialize(data) {
  const fail = () => {
    throw new Error(
      "Ten plik nie jest poprawnym projektem Ala Paint. Wybierz plik .json zapisany w naszej pracowni.",
    );
  };
  if (!data || data.format !== "ala-paint" || data.version !== PROJECT_VERSION)
    fail();
  if (
    !Number.isInteger(data.width) ||
    !Number.isInteger(data.height) ||
    data.width < 1 ||
    data.height < 1 ||
    data.width > 2048 ||
    data.height > 2048
  )
    fail();
  if (
    typeof data.name !== "string" ||
    !data.name.trim() ||
    data.name.length > 80
  )
    fail();
  if (!BACKGROUNDS.some((item) => item.id === data.background)) fail();
  if (
    !Array.isArray(data.layers) ||
    data.layers.length < 1 ||
    data.layers.length > MAX_LAYERS ||
    data.width * data.height * data.layers.length > 20_000_000
  )
    fail();
  const ids = new Set();
  for (const layer of data.layers) {
    if (
      !layer ||
      typeof layer.id !== "string" ||
      layer.id.length > 80 ||
      ids.has(layer.id) ||
      typeof layer.name !== "string" ||
      layer.name.length > 40 ||
      typeof layer.visible !== "boolean"
    )
      fail();
    if (
      typeof layer.image !== "string" ||
      layer.image.length > MAX_FILE_BYTES ||
      !/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/.test(layer.image)
    )
      fail();
    // Sprawdzamy rozmiar PNG przed dekodowaniem, aby nie ładować olbrzymich obrazów.
    const bytes = Uint8Array.from(
      atob(layer.image.split(",")[1].slice(0, 44)),
      (char) => char.charCodeAt(0),
    );
    if (
      bytes.length < 24 ||
      [137, 80, 78, 71, 13, 10, 26, 10].some(
        (byte, index) => bytes[index] !== byte,
      )
    )
      fail();
    const header = new DataView(bytes.buffer);
    if (
      header.getUint32(16) !== data.width ||
      header.getUint32(20) !== data.height
    )
      fail();
    ids.add(layer.id);
  }
  if (!ids.has(data.activeLayerId)) fail();
  // Dopiero po sprawdzeniu wszystkich warstw można podmienić bieżący projekt.
  const layers = [];
  for (const layer of data.layers) {
    const image = new Image();
    image.src = layer.image;
    try {
      await image.decode();
    } catch {
      fail();
    }
    if (
      image.naturalWidth !== data.width ||
      image.naturalHeight !== data.height
    )
      fail();
    const canvas = makeCanvas(data.width, data.height);
    canvas.getContext("2d").drawImage(image, 0, 0);
    layers.push({
      id: layer.id,
      name: layer.name,
      visible: layer.visible,
      canvas,
    });
  }
  return {
    name: data.name,
    width: data.width,
    height: data.height,
    background: data.background,
    activeLayerId: data.activeLayerId,
    layers,
  };
}

export function paintBackground(context, project) {
  const background = BACKGROUNDS.find((item) => item.id === project.background);
  if (background.color) {
    context.fillStyle = background.color;
    context.fillRect(0, 0, project.width, project.height);
  }
}

export function flatten(project) {
  const canvas = makeCanvas(project.width, project.height);
  const context = canvas.getContext("2d");
  paintBackground(context, project);
  project.layers.forEach((layer) => {
    if (layer.visible) context.drawImage(layer.canvas, 0, 0);
  });
  return canvas;
}

export function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function filename(name) {
  return (
    name
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
      .slice(0, 80) || "moj-rysunek"
  );
}
