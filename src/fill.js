import { shapeColor } from "./colors.js";

// Wiaderko szuka sąsiadujących pikseli na jednej warstwie, bez rekurencji.
export function fillArea(canvas, point, settings) {
  const { width, height } = canvas;
  const x = Math.floor(point.x);
  const y = Math.floor(point.y);
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const context = canvas.getContext("2d");
  const image = context.getImageData(0, 0, width, height);
  const pixels = image.data;
  const start = y * width + x;
  const target = pixels.slice(start * 4, start * 4 + 4);
  const visited = new Uint8Array(width * height);
  const region = new Int32Array(width * height);
  let count = 1;
  region[0] = start;
  visited[start] = 1;
  let left = x,
    right = x,
    top = y,
    bottom = y;

  function visit(index) {
    if (visited[index]) return;
    visited[index] = 1;
    const offset = index * 4;
    if (Math.abs(pixels[offset + 3] - target[3]) > 24) return;
    // Niewidoczny kolor przezroczystego piksela nie stanowi granicy.
    for (let channel = 0; channel < 3; channel++) {
      if (
        Math.abs(
          (pixels[offset + channel] * pixels[offset + 3]) / 255 -
            (target[channel] * target[3]) / 255,
        ) > 24
      )
        return;
    }
    region[count++] = index;
  }

  for (let cursor = 0; cursor < count; cursor++) {
    const index = region[cursor];
    const px = index % width;
    const py = Math.floor(index / width);
    left = Math.min(left, px);
    right = Math.max(right, px);
    top = Math.min(top, py);
    bottom = Math.max(bottom, py);
    if (px > 0) visit(index - 1);
    if (px < width - 1) visit(index + 1);
    if (py > 0) visit(index - width);
    if (py < height - 1) visit(index + width);
  }

  const paint = document.createElement("canvas");
  paint.width = width;
  paint.height = height;
  const brush = paint.getContext("2d");
  brush.fillStyle = shapeColor(
    brush,
    settings,
    { x: left, y: top },
    { x: right, y: bottom },
  );
  brush.fillRect(left, top, right - left + 1, bottom - top + 1);
  const colors = brush.getImageData(0, 0, width, height).data;
  for (let cursor = 0; cursor < count; cursor++) {
    const offset = region[cursor] * 4;
    for (let channel = 0; channel < 4; channel++)
      pixels[offset + channel] = colors[offset + channel];
  }
  context.putImageData(image, 0, 0);
}
