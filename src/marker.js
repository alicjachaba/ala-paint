import { drawStroke } from "./drawing.js";

// Obwódka i kolor rosną osobno: kolejne ruchy nie zostawiają czarnych szwów.
export function createMarker(width, height, settings) {
  const outline = document.createElement("canvas");
  const ink = document.createElement("canvas");
  for (const canvas of [outline, ink]) {
    canvas.width = width;
    canvas.height = height;
  }
  const border = Math.max(1, settings.size * 0.14);
  return {
    add(from, to) {
      drawStroke(outline.getContext("2d"), from, to, {
        tool: "brush",
        color: "#000000",
        size: settings.size + border * 2,
      });
      drawStroke(ink.getContext("2d"), from, to, settings);
    },
    draw(context) {
      context.drawImage(outline, 0, 0);
      context.drawImage(ink, 0, 0);
    },
  };
}
