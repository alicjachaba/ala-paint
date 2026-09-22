import { MAX_DIMENSION, MAX_LAYER_PIXELS, MAX_LAYERS } from "./project.js";

// CSS wyznacza wielkość kartki na ekranie; dopiero tutaj przeliczamy ją na piksele obrazu.
export function paperSize(space, density = window.devicePixelRatio || 1) {
  const bounds = space.getBoundingClientRect();
  const width = Math.max(1, bounds.width);
  const height = Math.max(1, bounds.height);
  // Zostawiamy pamięć na wszystkie warstwy także na dużych monitorach Retina.
  const pixelRatio = Math.min(
    density,
    4,
    MAX_DIMENSION / width,
    MAX_DIMENSION / height,
    Math.sqrt(MAX_LAYER_PIXELS / MAX_LAYERS / (width * height)),
  );
  return {
    width: Math.max(1, Math.floor(width * pixelRatio)),
    height: Math.max(1, Math.floor(height * pixelRatio)),
    pixelRatio,
  };
}
