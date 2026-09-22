export const PATTERNS = [
  ["tiger", "Tygrysie paski", "#efaa50"],
  ["spots", "Kocie cętki", "#e8bd82"],
  ["giraffe", "Żyrafa", "#f9dfa0"],
  ["zebra", "Zebra", "#fffaf1"],
  ["fur", "Futerko", "#c59b7b"],
];

const tiles = new Map();
const paints = new Map();
export const patternInfo = (color) => PATTERNS.find(([id]) => id === color);

// Małe, powtarzane kafelki powstają raz i są wspólne dla próbek i rysowania.
export function patternTile(id) {
  if (tiles.has(id)) return tiles.get(id);
  const tile = document.createElement("canvas");
  tile.width = tile.height = 64;
  const ctx = tile.getContext("2d");
  ctx.fillStyle = patternInfo(id)[2];
  ctx.fillRect(0, 0, 64, 64);
  if (id === "tiger" || id === "zebra") {
    ctx.fillStyle = id === "tiger" ? "#503128" : "#302e38";
    for (let y = -64; y <= 64; y += 32) {
      for (const direction of [-1, 1]) {
        ctx.save();
        ctx.translate(direction === 1 ? 0 : 64, y + (direction === 1 ? 0 : 16));
        ctx.scale(direction, 1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(18, 0, 21, 17, 47, 21);
        ctx.bezierCurveTo(26, 26, 14, 12, 0, 12);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
  } else if (id === "spots") {
    for (const [x, y, radius, angle] of [
      [15, 15, 9, 0.4],
      [47, 42, 11, -0.5],
      [12, 49, 6, 0],
      [48, 11, 5, 0],
    ]) {
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * 0.75, angle, 0, Math.PI * 2);
      ctx.fillStyle = "#6b4434";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#382b29";
      ctx.stroke();
    }
  } else if (id === "giraffe") {
    ctx.fillStyle = "#a76834";
    for (const points of [
      [
        [4, 4],
        [29, 3],
        [26, 25],
        [9, 30],
        [3, 19],
      ],
      [
        [36, 3],
        [60, 7],
        [60, 26],
        [44, 31],
        [33, 22],
      ],
      [
        [5, 38],
        [24, 32],
        [32, 45],
        [26, 60],
        [3, 59],
      ],
      [
        [39, 38],
        [59, 33],
        [61, 59],
        [34, 60],
      ],
    ]) {
      ctx.beginPath();
      points.forEach(([x, y], index) =>
        index ? ctx.lineTo(x, y) : ctx.moveTo(x, y),
      );
      ctx.closePath();
      ctx.fill();
    }
  } else if (id === "fur") {
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    for (let y = -8; y < 72; y += 8) {
      for (let x = -8; x < 72; x += 8) {
        const offset = ((y / 8) % 2) * 4;
        ctx.strokeStyle = (x + y) % 24 === 0 ? "#f4d7b5" : "#815b46";
        ctx.beginPath();
        ctx.moveTo(x + offset, y);
        ctx.quadraticCurveTo(x + offset + 1, y + 6, x + offset + 5, y + 13);
        ctx.stroke();
      }
    }
  }
  tiles.set(id, tile);
  return tile;
}

export function patternPaint(color) {
  if (!patternInfo(color)) return color;
  if (!paints.has(color)) {
    const tile = patternTile(color);
    paints.set(color, tile.getContext("2d").createPattern(tile, "repeat"));
  }
  return paints.get(color);
}
