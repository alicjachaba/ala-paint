import {
  drawOcean,
  drawReef,
  drawCity,
  drawJungle,
  drawArctic,
} from "./landscapes.js";

export const BACKGROUNDS = [
  { id: "white", name: "Białe", color: "#ffffff" },
  { id: "cream", name: "Waniliowe", color: "#fff5df" },
  { id: "mint", name: "Miętowe", color: "#e7f6ef" },
  { id: "sky", name: "Niebo", color: "#e4f1ff" },
  { id: "pink", name: "Różowe", color: "#ffedf3" },
  { id: "transparent", name: "Przezroczyste", color: null },
  { id: "savanna", name: "Sawanna", color: "#fff9ed", landscape: true },
  { id: "forest", name: "Las", color: "#f2f8f5", landscape: true },
  { id: "meadow", name: "Łąka", color: "#f2f9fc", landscape: true },
  { id: "ocean", name: "Ocean", color: "#eff8fc", landscape: true },
  { id: "reef", name: "Rafa koralowa", color: "#edf9fa", landscape: true },
  { id: "city", name: "Miasto", color: "#f5f4fc", landscape: true },
  { id: "jungle", name: "Dżungla", color: "#f1f8ed", landscape: true },
  {
    id: "arctic",
    name: "Arktyczny krajobraz",
    color: "#eff6fc",
    landscape: true,
  },
];

const landscapes = new Map();
const landscapePainters = {
  ocean: drawOcean,
  reef: drawReef,
  city: drawCity,
  jungle: drawJungle,
  arctic: drawArctic,
};

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Krajobrazy powstają lokalnie. Ten sam obraz służy kartce, próbkom i eksportowi.
function landscape(id) {
  if (landscapes.has(id)) return landscapes.get(id);
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = BACKGROUNDS.find((bg) => bg.id === id).color;
  ctx.fillRect(0, 0, 960, 640);
  if (landscapePainters[id]) landscapePainters[id](ctx);
  else drawCountryside(ctx, id);
  landscapes.set(id, canvas);
  return canvas;
}

function drawCountryside(ctx, id) {
  const savanna = id === "savanna";
  const forest = id === "forest";
  ellipse(ctx, 770, 110, 52, 52, savanna ? "#faedce" : "#fff6db");
  for (const [x, y] of [
    [150, 100],
    [510, 160],
  ]) {
    ellipse(ctx, x, y, 75, 19, "#ffffff");
    ellipse(ctx, x - 20, y - 12, 32, 22, "#ffffff");
  }
  ellipse(ctx, 270, 650, 780, 300, savanna ? "#f6edda" : "#e7f1e4");
  ellipse(ctx, 830, 760, 780, 360, savanna ? "#f4e7ce" : "#dfeddd");

  if (savanna) {
    for (const [x, y, scale] of [
      [145, 465, 1],
      [790, 415, 0.65],
    ]) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.strokeStyle = "#dfd4be";
      ctx.lineWidth = 13;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-5, -125);
      ctx.moveTo(-4, -85);
      ctx.lineTo(-55, -142);
      ctx.moveTo(-4, -100);
      ctx.lineTo(48, -145);
      ctx.stroke();
      ellipse(ctx, -12, -152, 106, 29, "#e1e7ce");
      ellipse(ctx, 40, -167, 63, 23, "#e6ecd6");
      ctx.restore();
    }
    ctx.strokeStyle = "#e2d8bd";
    ctx.lineWidth = 3;
    for (let x = 40; x < 960; x += 115) {
      const y = 540 + (x % 3) * 23;
      ctx.beginPath();
      ctx.moveTo(x - 9, y - 17);
      ctx.lineTo(x, y);
      ctx.lineTo(x + 7, y - 25);
      ctx.stroke();
    }
  } else if (forest) {
    for (const [x, y, scale] of [
      [70, 480, 1.2],
      [200, 425, 0.85],
      [345, 400, 0.65],
      [680, 410, 0.75],
      [805, 450, 1.1],
      [925, 510, 1.35],
    ]) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#e0d9cf";
      ctx.fillRect(-7, -150, 14, 155);
      for (let level = 0; level < 3; level++) {
        const top = -250 + level * 55;
        ctx.fillStyle = level % 2 ? "#d9e9dd" : "#e1eee3";
        ctx.beginPath();
        ctx.moveTo(0, top);
        ctx.lineTo(65 + level * 10, top + 115);
        ctx.lineTo(-65 - level * 10, top + 115);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
    ellipse(ctx, 60, 630, 170, 70, "#d5e7d6");
    ellipse(ctx, 910, 640, 180, 80, "#d5e7d6");
  } else {
    for (let index = 0; index < 25; index++) {
      const x = 25 + ((index * 137) % 910);
      const y = 470 + ((index * 53) % 160);
      ctx.strokeStyle = "#ccdcca";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + 18);
      ctx.lineTo(x, y);
      ctx.stroke();
      for (let petal = 0; petal < 5; petal++) {
        const angle = (petal * Math.PI * 2) / 5;
        ellipse(
          ctx,
          x + Math.cos(angle) * 6,
          y + Math.sin(angle) * 6,
          5,
          5,
          index % 2 ? "#f7e2ea" : "#fcfaf2",
        );
      }
      ellipse(ctx, x, y, 3, 3, "#ecdfb7");
    }
  }
}

export function paintBackground(context, project) {
  const background = BACKGROUNDS.find((item) => item.id === project.background);
  if (background.landscape) {
    context.drawImage(
      landscape(background.id),
      0,
      0,
      project.width,
      project.height,
    );
  } else if (background.color) {
    context.fillStyle = background.color;
    context.fillRect(0, 0, project.width, project.height);
  }
}

export function backgroundPreview(id) {
  return landscape(id).toDataURL();
}
