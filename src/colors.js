import { patternPaint } from "./patterns.js";

// Tęcza przesuwa się wraz z kreską, niezależnie od szybkości myszy.
export function nextColor(settings, distance = 8) {
  if (settings.color !== "rainbow") return patternPaint(settings.color);
  settings.hue = ((settings.hue || 0) + distance * 0.8) % 360;
  return `hsl(${settings.hue} 85% 55%)`;
}

export function shapeColor(context, settings, start, end) {
  if (settings.color !== "rainbow") return patternPaint(settings.color);
  const gradient = context.createLinearGradient(
    start.x,
    start.y,
    end.x === start.x ? end.x + 1 : end.x,
    end.y,
  );
  for (let stop = 0; stop <= 6; stop++) {
    gradient.addColorStop(stop / 6, `hsl(${stop * 60} 85% 55%)`);
  }
  return gradient;
}
