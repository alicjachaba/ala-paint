// Piasek zna tylko piksele swojej warstwy. Tło i inne warstwy nie są przeszkodami.
export function createSand(layerCanvas) {
  const context = layerCanvas.getContext("2d");
  const { width, height } = layerCanvas;
  const pixels = context.getImageData(0, 0, width, height).data;
  const occupied = new Uint8Array(width * height);
  for (let index = 0; index < occupied.length; index++) {
    occupied[index] = pixels[index * 4 + 3] > 0 ? 1 : 0;
  }
  let grains = [];
  const grainSize = Math.min(2, width, height);
  function mark(grain, value) {
    for (let y = 0; y < grainSize; y++) {
      for (let x = 0; x < grainSize; x++)
        occupied[(grain.y + y) * width + grain.x + x] = value;
    }
  }
  function free(x, y) {
    if (x < 0 || y < 0 || x + grainSize > width || y + grainSize > height)
      return false;
    for (let dy = 0; dy < grainSize; dy++) {
      for (let dx = 0; dx < grainSize; dx++) {
        if (occupied[(y + dy) * width + x + dx]) return false;
      }
    }
    return true;
  }
  function pour(point, size, color) {
    if (grains.length > 3000) return;
    for (let count = 0; count < Math.max(3, Math.ceil(size / 2)); count++) {
      const x = Math.floor(point.x + (Math.random() - 0.5) * Math.max(8, size));
      const y = Math.floor(point.y + (Math.random() - 0.5) * 6);
      if (!free(x, y)) continue;
      const grain = { x, y, speed: 0, color };
      mark(grain, 2);
      grains.push(grain);
    }
  }
  function step(finish = false) {
    const falling = [];
    // Dolne ziarenka przesuwamy pierwsze, aby górne mogły spaść za nimi.
    grains.sort((a, b) => b.y - a.y);
    for (const grain of grains) {
      mark(grain, 0);
      grain.speed = Math.min(16, grain.speed + 0.55);
      let stopped = false;
      const steps = finish ? height : Math.floor(grain.speed);
      for (let move = 0; move < steps; move++) {
        if (free(grain.x, grain.y + 1)) {
          grain.y++;
        } else {
          const direction = Math.random() < 0.5 ? -1 : 1;
          const slide = [direction, -direction].find((dx) =>
            free(grain.x + dx, grain.y + 1),
          );
          if (slide !== undefined) {
            grain.x += slide;
            grain.y++;
          } else {
            // Ziarenko czekające na inne spadające ziarenko nie zastyga w powietrzu.
            stopped = grain.y + grainSize === height;
            for (let x = 0; x < grainSize && !stopped; x++) {
              stopped =
                occupied[(grain.y + grainSize) * width + grain.x + x] === 1;
            }
            break;
          }
        }
      }
      mark(grain, stopped ? 1 : 2);
      if (stopped) {
        context.fillStyle = grain.color;
        context.fillRect(grain.x, grain.y, grainSize, grainSize);
      } else falling.push(grain);
    }
    grains = falling;
    return grains.length;
  }
  return {
    pour,
    step,
    settle() {
      // Każdy przebieg osadza dolne ziarenka lub przesuwa pozostałe w dół.
      while (grains.length) step(true);
    },
    draw(target) {
      for (const grain of grains) {
        target.fillStyle = grain.color;
        target.fillRect(grain.x, grain.y, grainSize, grainSize);
      }
    },
  };
}
